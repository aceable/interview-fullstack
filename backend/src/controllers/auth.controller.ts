import bcrypt from 'bcryptjs';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { WithoutId } from 'mongodb';
import { UserRole, type User } from '../../../shared/types.ts';
import { getCollection } from '../config/database.ts';

const JWT_SECRET = process.env.JWT_SECRET ?? 'interview-app-secret';

// Generate JWT
const generateToken = (id: string): string => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Define request body interfaces for type safety
interface RegisterRequestBody {
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

// Define a custom request that includes user property added by auth middleware
interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

// Express handler type
type ExpressHandler = (
  req: Request | AuthRequest,
  res: Response,
  next?: NextFunction
) => Promise<void> | void;

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser: ExpressHandler = async (req: Request<unknown, unknown, RegisterRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide all required fields',
      });
      return;
    }

    const usersCollection = getCollection('users');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'User already exists',
      });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user (without _id, MongoDB will generate it)
    const userToCreate: WithoutId<User> = {
      email,
      password: hashedPassword,
      role: UserRole.USER,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne<User>(userToCreate);
    
    if (result.acknowledged) {
      // Now we have the MongoDB document with _id
      const createdUser: User = {
        _id: result.insertedId,
        ...userToCreate,
      };

      res.status(201).json({
        success: true,
        data: {
          user: createdUser,
          token: generateToken(result.insertedId),
        },
      });
      return;
    } else {
      res.status(400).json({
        success: false,
        error: 'Invalid user data',
      });
      return;
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser: ExpressHandler = async (req: Request<object, unknown, LoginRequestBody>, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
      return;
    }

    const usersCollection = getCollection('users');

    // Check if user exists
    const user = await usersCollection.findOne<User>({ email });

    if (user && await bcrypt.compare(password, user.password ?? '')) {
      const userData: Partial<User> = {
        _id: user._id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      
      res.json({
        success: true,
        data: {
          user: userData,
          token: generateToken(user._id),
        },
      });
      return;
    } else {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
      return;
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile: ExpressHandler = async (req, res) => {
  try {
    const authReq = req as AuthRequest;
    const userId = authReq.user?.id;
    
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Not authorized',
      });
      return;
    }
    
    const usersCollection = getCollection('users');
    const user = await usersCollection.findOne<User>({ _id: userId });

    if (user) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        } as User,
      });
      return;
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
};