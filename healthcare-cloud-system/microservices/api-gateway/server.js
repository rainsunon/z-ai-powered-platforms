const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const promClient = require('prom-client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request tracking middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration.labels(req.method, req.path, res.statusCode).observe(duration);
    httpRequestTotal.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});

// Service URLs from environment
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service';
const APPOINTMENT_SERVICE_URL = process.env.APPOINTMENT_SERVICE_URL || 'http://appointment-service';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://payment-service';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'api-gateway', timestamp: new Date().toISOString() });
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// User routes
app.post('/api/users/register', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/register`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling user service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to register user' 
    });
  }
});

app.post('/api/users/login', async (req, res) => {
  try {
    const response = await axios.post(`${USER_SERVICE_URL}/login`, req.body);
    res.json(response.data);
  } catch (error) {
    console.error('Error calling user service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to login' 
    });
  }
});

app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${USER_SERVICE_URL}/profile/${req.user.userId}`, {
      headers: { 'Authorization': req.headers['authorization'] }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling user service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to get profile' 
    });
  }
});

// Appointment routes
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${APPOINTMENT_SERVICE_URL}/appointments`, req.body, {
      headers: { 'Authorization': req.headers['authorization'] }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling appointment service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to create appointment' 
    });
  }
});

app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/appointments`, {
      headers: { 'Authorization': req.headers['authorization'] },
      params: req.query
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling appointment service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to get appointments' 
    });
  }
});

app.get('/api/appointments/:id', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${APPOINTMENT_SERVICE_URL}/appointments/${req.params.id}`, {
      headers: { 'Authorization': req.headers['authorization'] }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling appointment service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to get appointment' 
    });
  }
});

// Payment routes
app.post('/api/payments', authenticateToken, async (req, res) => {
  try {
    const response = await axios.post(`${PAYMENT_SERVICE_URL}/payments`, req.body, {
      headers: { 'Authorization': req.headers['authorization'] }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling payment service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to process payment' 
    });
  }
});

app.get('/api/payments/:id', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${PAYMENT_SERVICE_URL}/payments/${req.params.id}`, {
      headers: { 'Authorization': req.headers['authorization'] }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error calling payment service:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.error || 'Failed to get payment' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Metrics: http://localhost:${PORT}/metrics`);
});
