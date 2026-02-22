import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

// Import Routes
import adminRoutes from './routes/adminRoutes';
import chatRoutes from './routes/chatRoutes';
import lawyerRoutes from './routes/lawyerRoutes'; 
import paymentRoutes from './routes/paymentRoutes';
import contactRoutes from './routes/contactRoutes';
import documentAnalysisRoutes from './routes/documentAnalysisRoutes';

// Import ElasticSearch initialization
import { initializeIndices, checkConnection } from './services/elasticsearchService';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"], 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI as string)
  .then(() => console.log(`✅ MongoDB Connected`))
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Initialize ElasticSearch
const initElasticSearch = async () => {
  try {
    const connection = await checkConnection();
    if (connection.connected) {
      console.log(`✅ ElasticSearch Connected (${connection.status})`);
      await initializeIndices();
    } else {
      console.warn(`⚠️ ElasticSearch not available: ${connection.error}`);
    }
  } catch (error) {
    console.warn('⚠️ ElasticSearch initialization skipped (will retry on first use)');
  }
};

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/lawyers', lawyerRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/documents', documentAnalysisRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const esConnection = await checkConnection();
  res.json({
    status: 'ok',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    elasticsearch: esConnection.connected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  await initElasticSearch();
});