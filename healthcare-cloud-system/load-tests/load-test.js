import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');

// Test configuration
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 100 },  // Ramp up to 100 users
    { duration: '5m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 200 },  // Ramp up to 200 users - trigger HPA
    { duration: '5m', target: 200 },  // Stay at 200 users
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    errors: ['rate<0.1'],              // Error rate should be less than 10%
  },
};

const BASE_URL = __ENV.API_GATEWAY_URL || 'http://localhost';

// Test data
const users = [
  { email: 'patient1@test.com', password: 'password123' },
  { email: 'patient2@test.com', password: 'password123' },
  { email: 'patient3@test.com', password: 'password123' },
];

export default function () {
  // Select random user
  const user = users[Math.floor(Math.random() * users.length)];
  
  // Test 1: User Registration
  const registrationPayload = JSON.stringify({
    email: `user_${Date.now()}_${__VU}@test.com`,
    name: `Test User ${__VU}`,
    phone: `555-${Math.floor(Math.random() * 10000)}`,
    password: 'testpassword123',
    role: 'patient'
  });

  let response = http.post(`${BASE_URL}/api/users/register`, registrationPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(response, {
    'registration status is 200': (r) => r.status === 200,
    'registration has token': (r) => r.json('access_token') !== undefined,
  }) || errorRate.add(1);

  sleep(1);

  // Test 2: User Login
  const loginPayload = JSON.stringify({
    email: user.email,
    password: user.password,
  });

  response = http.post(`${BASE_URL}/api/users/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  let token = null;
  const loginSuccess = check(response, {
    'login status is 200': (r) => r.status === 200,
    'login has token': (r) => r.json('access_token') !== undefined,
  });

  if (loginSuccess) {
    token = response.json('access_token');
  } else {
    errorRate.add(1);
  }

  sleep(1);

  if (token) {
    // Test 3: Create Appointment
    const appointmentPayload = JSON.stringify({
      patientId: Math.floor(Math.random() * 100) + 1,
      doctorId: Math.floor(Math.random() * 20) + 1,
      appointmentDatetime: new Date(Date.now() + 86400000).toISOString(),
      reason: 'Regular checkup',
    });

    response = http.post(`${BASE_URL}/api/appointments`, appointmentPayload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const appointmentId = response.json('id');
    check(response, {
      'appointment created': (r) => r.status === 200,
      'appointment has id': (r) => r.json('id') !== undefined,
    }) || errorRate.add(1);

    sleep(1);

    // Test 4: Get Appointments
    response = http.get(`${BASE_URL}/api/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    check(response, {
      'get appointments status is 200': (r) => r.status === 200,
      'appointments is array': (r) => Array.isArray(r.json()),
    }) || errorRate.add(1);

    sleep(1);

    // Test 5: Process Payment (if appointment created)
    if (appointmentId) {
      const paymentPayload = JSON.stringify({
        appointment_id: appointmentId,
        user_id: Math.floor(Math.random() * 100) + 1,
        amount: 150.00,
        payment_method: 'card',
      });

      response = http.post(`${BASE_URL}/api/payments`, paymentPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      check(response, {
        'payment processed': (r) => r.status === 200 || r.status === 201,
        'payment has id': (r) => r.json('payment_id') !== undefined,
      }) || errorRate.add(1);
    }
  }

  sleep(2);
}

export function handleSummary(data) {
  return {
    'summary.json': JSON.stringify(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;
  
  let summary = `
${indent}Test Summary
${indent}============
${indent}
${indent}Total Requests:     ${data.metrics.http_reqs.values.count}
${indent}Failed Requests:    ${data.metrics.http_req_failed ? data.metrics.http_req_failed.values.passes : 0}
${indent}Request Duration:
${indent}  - Average:        ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms
${indent}  - 95th percentile: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms
${indent}  - Max:            ${data.metrics.http_req_duration.values.max.toFixed(2)}ms
${indent}
${indent}Virtual Users:      ${data.metrics.vus.values.value}
${indent}Iterations:         ${data.metrics.iterations.values.count}
`;

  return summary;
}