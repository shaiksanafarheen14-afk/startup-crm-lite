import express from 'express';
import { check } from 'express-validator';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
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

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

const leadValidation = [
    check('name', 'Name must be at least 2 characters').notEmpty().isLength({ min: 2 }),
    check('company', 'Company is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('status', 'Invalid status').optional().isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost']),
    check('source', 'Invalid source').optional().isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
];

const statusValidation = [
    check('status', 'Invalid status').isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
];

// NOTE: Routes for stats must come before /:id routes to prevent 'stats' being evaluated as an ID
router.get('/stats/summary', getLeadStats);
router.get('/stats/monthly', getMonthlyStats);

router.route('/')
    .get(getLeads)
    .post(validate(leadValidation), createLead);

router.get('/search', searchLeads);

router.route('/:id')
    .get(getLeadById)
    .put(validate(leadValidation), updateLead)
    .delete(deleteLead);

router.patch('/:id/status', validate(statusValidation), updateLeadStatus);

export default router;