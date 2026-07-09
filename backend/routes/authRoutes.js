import express from 'express';
import { check } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const registerValidation = [
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
];

const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists()
];

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
// Note: In production, apply express-rate-limit middleware here to prevent brute-force attacks
router.post('/register', validate(registerValidation), register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
// Note: In production, apply express-rate-limit middleware here to prevent brute-force attacks
router.post('/login', validate(loginValidation), login);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', protect, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, updateProfile);

export default router;