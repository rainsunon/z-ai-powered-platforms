import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },   // Warm up
    { duration: '30s', target: 500 },  // Spike to 500 users
    { duration: '1m', target: 500 },   // Stay at spike
    { duration: '30s', target: 10 },   // Scale down
  ],
};

const BASE_URL = __ENV.API_GATEWAY_URL || 'http://localhost';

export default function () {
  const response = http.get(`${BASE_URL}/health`);
  check(response, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(1);
}