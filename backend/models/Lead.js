import mongoose from 'mongoose';

/**
 * Lead Schema definition
 */
export const leadSchema = new mongoose.Schema({
  /**
   * Name of the lead
   * Must be between 2 and 100 characters
   */
  name: {
    type: String,
    required: [true, 'Lead name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters long'],
    maxLength: [100, 'Name cannot exceed 100 characters']
  },
  /**
   * Company name the lead is associated with
   */
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  /**
   * Lead's email address
   * Must be properly formatted
   */
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  /**
   * Lead's phone number
   */
  phone: {
    type: String,
    trim: true
  },
  /**
   * Current status of the lead in the sales pipeline
   */
  status: {
    type: String,
    enum: {
      values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
      message: '{VALUE} is not a valid status'
    },
    default: 'New'
  },
  /**
   * Source where the lead was acquired from
   */
  source: {
    type: String,
    enum: {
      values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
      message: '{VALUE} is not a valid source'
    },
    default: 'Website'
  },
  /**
   * Additional notes about the lead
   */
  notes: {
    type: String,
    trim: true,
    maxLength: [1000, 'Notes cannot exceed 1000 characters']
  },
  /**
   * User ID of the owner who created or manages this lead
   */
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Lead owner is required']
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
  toJSON: { virtuals: true }, // Ensure virtual fields are included in JSON output
  toObject: { virtuals: true }
});

/**
 * Virtual field to calculate the age of the lead in days
 */
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
});

// Indexes for optimized querying
// Compound index on owner and status for fast dashboard queries filtering by owner and status
leadSchema.index({ owner: 1, status: 1 });

// Index on email for fast lookups by email
leadSchema.index({ email: 1 });

// Index for sorting and date range queries
leadSchema.index({ owner: 1, createdAt: -1 });

// Index for filtering by source
leadSchema.index({ owner: 1, source: 1 });

const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
