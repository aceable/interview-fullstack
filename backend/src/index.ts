import cors from 'cors';
import express from 'express';
import morgan from 'morgan'; // Logging middleware

import { connectToDatabase } from './config/database.ts';
import { errorHandler } from './middlewares/error.middleware.ts';
import apiRoutes from './routes/api.routes.ts';
import authRoutes from './routes/auth.routes.ts';

// Initialize express app
const app = express();
const PORT = Number(process.env.PORT ?? 5001);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectToDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Interview API' });
});

// Error handling middleware
app.use(errorHandler);

// Start server and store the server instance
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${String(PORT)}`);
});

// Ensure process doesn't exit by adding error handlers
server.on('error', (error) => {
  console.error('Server error:', error);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  // Keep the server running despite uncaught exceptions
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Keep the server running despite unhandled promise rejections
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
  });
});

export default app;