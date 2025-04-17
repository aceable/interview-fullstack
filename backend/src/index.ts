import cors from 'cors';
import express from 'express';
import morgan from 'morgan';

import { connectToDatabase } from './config/database.ts';
import { errorHandler } from './middlewares/error.middleware.ts';
import apiRoutes from './routes/api.routes.ts';
import authRoutes from './routes/auth.routes.ts';

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Connect to MongoDB
connectToDatabase().catch(console.error);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Home route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Interview API' });
});

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;