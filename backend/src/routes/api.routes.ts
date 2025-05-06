import { Router } from 'express';

import { protect, admin } from '../middlewares/auth.middleware.ts';

const router = Router();

// Public route - Example endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'API is running',
      time: new Date().toISOString()
    }
  });
});

// Protected route - Requires authentication
router.get('/protected', protect, (req, res) => {
  res.json({
    success: true,
    message: 'You have access to protected data',
    data: {
      time: new Date().toISOString()
    }
  });
});

// Admin route - Requires admin privileges
router.get('/admin', protect, admin, (req, res) => {
  res.json({
    success: true,
    message: 'You have admin access',
    data: {
      time: new Date().toISOString()
    }
  });
});

export default router;