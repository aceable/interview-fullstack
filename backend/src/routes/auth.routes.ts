import { Router } from 'express';

import { registerUser, loginUser, getUserProfile } from '../controllers/auth.controller.ts';
import { protect } from '../middlewares/auth.middleware.ts';

const router = Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);

export default router;