import express, { Request, Response, NextFunction, RequestHandler as ExpressRequestHandler } from 'express';
import { body, validationResult, ValidationChain } from 'express-validator';
import { register, login, getMe, logout, googleAuth } from '../controllers/auth';
import { protect } from '../middleware/auth';

const router = express.Router();

// Input validation middleware
const validateRequest = (validations: ValidationChain[]): ExpressRequestHandler[] => {
  return [
    // Run all validations
    ...validations,
    
    // Handle validation result
    (req: Request, res: Response, next: NextFunction) => {
      const errors = validationResult(req);
      
      if (errors.isEmpty()) {
        return next();
      }

      // Return validation errors
      res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
  ];
};

// Public routes
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty().trim().escape(),
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Please enter a password with 6 or more characters')
      .isLength({ min: 6 })
      .matches(/\d/)
      .withMessage('Password must contain a number')
      .matches(/[A-Z]/)
      .withMessage('Password must contain at least one uppercase letter'),
    // @ts-ignore - express-validator types are not properly exported
  ].concat(validateRequest([])),
  register as express.RequestHandler
);

// Google OAuth route
router.post(
  '/google',
  [
    body('email', 'Valid email is required').isEmail().normalizeEmail(),
    body('idToken', 'ID token is required').not().isEmpty(),
    // @ts-ignore - express-validator types are not properly exported
  ].concat(validateRequest([])),
  googleAuth as express.RequestHandler
);

// User login route
router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail().normalizeEmail(),
    body('password', 'Password is required').not().isEmpty().trim(),
    // @ts-ignore - express-validator types are not properly exported
  ].concat(validateRequest([])),
  login as express.RequestHandler
); // POST /api/v1/auth/login

// Protected routes (require authentication)
router.get('/me', protect as express.RequestHandler, getMe as express.RequestHandler);
router.get('/logout', protect as express.RequestHandler, logout as express.RequestHandler);

// Additional OAuth providers can be added here

export default router;