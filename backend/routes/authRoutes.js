import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

const updateProfileValidation = [
  body('name').optional().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

router.post('/register', validate(registerValidation), register);
router.post('/login', validate(loginValidation), login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, validate(updateProfileValidation), updateProfile);

export default router;
