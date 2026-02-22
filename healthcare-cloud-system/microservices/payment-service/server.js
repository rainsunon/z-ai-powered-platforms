const express = require('express');
const { Pool } = require('pg');
const { Kafka } = require('kafkajs');
const promClient = require('prom-client');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8003;

app.use(express.json());

// Prometheus metrics
const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const paymentCounter = new promClient.Counter({
  name: 'payments_total',
  help: 'Total number of payments processed',
  labelNames: ['status'],
  registers: [register]
});

// PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://dbadmin:password@localhost:5432/healthcaredb'
});

// Create payments table
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        payment_id VARCHAR(255) UNIQUE NOT NULL,
        appointment_id BIGINT NOT NULL,
        user_id BIGINT NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) NOT NULL,
        payment_method VARCHAR(50),
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Payments table ready');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDB();

// Kafka setup
const kafka = new Kafka({
  clientId: 'payment-service',
  brokers: (process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092').split(',')
});

const producer = kafka.producer();

const connectKafka = async () => {
  try {
    await producer.connect();
    console.log('Connected to Kafka');
  } catch (error) {
    console.error('Failed to connect to Kafka:', error);
  }
};

connectKafka();

// Publish event to Kafka
const publishEvent = async (topic, message) => {
  try {
    await producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }]
    });
    console.log(`Published to ${topic}:`, message);
  } catch (error) {
    console.error('Failed to publish to Kafka:', error);
  }
};

// Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'payment-service',
    timestamp: new Date().toISOString()
  });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Process payment
app.post('/payments', async (req, res) => {
  const { appointment_id, user_id, amount, payment_method } = req.body;

  if (!appointment_id || !user_id || !amount) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const payment_id = uuidv4();
  const transaction_id = `txn_${Date.now()}`;

  try {
    // Simulate payment processing
    const status = Math.random() > 0.1 ? 'completed' : 'failed';

    // Insert payment record
    const result = await pool.query(
      `INSERT INTO payments (payment_id, appointment_id, user_id, amount, status, payment_method, transaction_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [payment_id, appointment_id, user_id, amount, status, payment_method || 'card', transaction_id]
    );

    const payment = result.rows[0];

    // Publish event to Kafka
    await publishEvent('payment-events', {
      event_type: 'payment_completed',
      payment_id: payment.payment_id,
      appointment_id: payment.appointment_id,
      user_id: payment.user_id,
      amount: payment.amount,
      status: payment.status,
      timestamp: new Date().toISOString()
    });

    paymentCounter.labels(status).inc();

    res.status(201).json({
      payment_id: payment.payment_id,
      status: payment.status,
      amount: payment.amount,
      transaction_id: payment.transaction_id,
      created_at: payment.created_at
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ error: 'Failed to process payment' });
  }
});

// Get payment by ID
app.get('/payments/:payment_id', async (req, res) => {
  const { payment_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM payments WHERE payment_id = $1',
      [payment_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Failed to fetch payment' });
  }
});

// Get payments by user
app.get('/payments/user/:user_id', async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Payment service running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  await producer.disconnect();
  await pool.end();
  process.exit(0);
});