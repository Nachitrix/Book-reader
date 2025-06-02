import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { IUser } from '../types/express';

// Generate JWT token
const generateToken = (id: string): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  // Use a default value that matches the expected type
  const expiresIn = process.env.JWT_EXPIRE ? parseInt(process.env.JWT_EXPIRE, 10) || '30d' : '30d';
  
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn,
      algorithm: 'HS256' as const
    } as jwt.SignOptions
  );
};

// Send token response
const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const token = generateToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    sameSite: 'lax' as const,
  };

  res.cookie('token', token, options);

  res.status(statusCode).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    },
  });
};

// @desc    Register a new user with email and password
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
        error: 'EMAIL_IN_USE'
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: 'user',
      isVerified: true, // For now, auto-verify users (email verification can be added later)
    });

    // Send welcome message (can be replaced with email notification in production)
    console.log(`Welcome to ReadSphere, ${name}! Your account has been created successfully.`);

    // Return user with token
    sendTokenResponse(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle validation errors
    if ((error as any).name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map((val: any) => val.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

// @desc    Register or login with Google OAuth
// @route   POST /api/v1/auth/google
// @access  Public
export const googleAuth = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { idToken, name, email, avatar } = req.body;
    
    // In a real implementation, verify the Google ID token
    // For now, we'll trust the token and proceed with the email
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for Google authentication'
      });
    }
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId && idToken) {
        user.googleId = idToken;
        await user.save();
      }
    } else {
      // Create new user with Google info
      user = await User.create({
        name: name || email.split('@')[0], // Use name or derive from email
        email,
        googleId: idToken,
        avatar: avatar || '',
        isVerified: true, // Google accounts are considered verified
        role: 'user'
      });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Google authentication error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google authentication'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, _next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide an email and password',
      });
      return;
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
      return;
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

// @desc    Get current logged in user (safe fields only)
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById((req as any).user.id).select('_id name email role isVerified');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
export const logout = (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
