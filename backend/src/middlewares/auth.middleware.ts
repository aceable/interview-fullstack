import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import type { UserRole } from '../../../shared/types.ts';
import { getCollection } from '../config/database.ts';

const JWT_SECRET = process.env.JWT_SECRET ?? 'interview-app-secret';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    role: UserRole;
  };
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, no token'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    
    // Get user from the token
    const usersCollection = getCollection('users');
    const user = await usersCollection.findOne({ _id: decoded.id });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized, user not found'
      });
    }
    
    // Set user to req.user
    req.user = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({
      success: false,
      error: 'Not authorized, token failed'
    });
  }
};

// Middleware to verify if user is an admin
export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === UserRole.ADMIN) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Not authorized as an admin'
    });
  }
};