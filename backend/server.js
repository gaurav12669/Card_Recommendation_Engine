const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const categoryRoutes = require('./src/routes/categoryRoutes');
const cardRoutes = require('./src/routes/cardRoutes');
const recommendationRoutes = require('./src/routes/recommendationRoutes');
const analyticsRoutes = require('./src/routes/analyticsRoutes');
const redisClient = require('./src/lib/RedisClient');
const mongoClient = require('./src/lib/MongoClient');
const errorHandler = require('./src/middleware/errorHandler');
const ApiError = require('./src/errors/ApiError');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: '*',
  credentials: false,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Card Genius API is running' });
});

// Routes
app.use('/categories', categoryRoutes);
app.use('/cards', cardRoutes);
app.use('/calculate-list', recommendationRoutes);
app.use('/analytics', analyticsRoutes);

app.use((req, res, next) => next(ApiError.notFound('Route not found')));

// Error handling middleware
app.use(errorHandler);

const startServer = async () => {
  try {
    await redisClient.getClient();
    console.log('Redis connection initialised');
  } catch (error) {
    console.error('Redis initialisation failed:', error.message);
  }

  try {
    await mongoClient.connect();
    console.log('MongoDB connection initialised');
  } catch (error) {
    console.error('MongoDB initialisation failed:', error.message);
  }

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
