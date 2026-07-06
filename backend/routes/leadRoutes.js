import express from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

const validStatuses = ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'];
const validSources = ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'];

const leadValidation = [
  body('name').notEmpty().withMessage('Name is required').isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('company').notEmpty().withMessage('Company is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('status').optional().isIn(validStatuses).withMessage('Invalid status value'),
  body('source').optional().isIn(validSources).withMessage('Invalid source value')
];

const statusValidation = [
  body('status').notEmpty().withMessage('Status is required').isIn(validStatuses).withMessage('Invalid status value')
];

// Apply protect middleware to ALL routes in this file
router.use(protect);

// Routes
router.route('/')
  .get(getLeads)
  .post(validate(leadValidation), createLead);

// Custom routes must be defined before /:id to avoid route collision
router.get('/stats', getLeadStats);
router.get('/monthly-stats', getMonthlyStats);
router.get('/search', searchLeads);

router.route('/:id')
  .get(getLeadById)
  .put(validate(leadValidation), updateLead)
  .delete(deleteLead);

router.patch('/:id/status', validate(statusValidation), updateLeadStatus);

export default router;
