import mongoose from 'mongoose';

/**
 * Lead Schema Definition
 */
export const leadSchema = new mongoose.Schema(
  {
    /**
     * Lead's full name.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Lead name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [100, 'Name cannot exceed 100 characters'],
    },
    /**
     * The company the lead works for or represents.
     * @type {String}
     */
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    /**
     * Lead's email address.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    /**
     * Lead's phone number.
     * @type {String}
     */
    phone: {
      type: String,
      trim: true,
    },
    /**
     * Current status of the lead in the sales pipeline.
     * @type {String}
     */
    status: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid lead status',
      },
      default: 'New',
    },
    /**
     * Source of how the lead was acquired.
     * @type {String}
     */
    source: {
      type: String,
      enum: {
        values: ['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'],
        message: '{VALUE} is not a valid lead source',
      },
      default: 'Website',
    },
    /**
     * Additional notes or context regarding the lead.
     * @type {String}
     */
    notes: {
      type: String,
      maxLength: [1000, 'Notes cannot exceed 1000 characters'],
    },
    /**
     * Reference to the User who created or owns this lead.
     * @type {mongoose.Schema.Types.ObjectId}
     */
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Lead must have an owner'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual field for age in days
leadSchema.virtual('age').get(function () {
  if (!this.createdAt) return 0;
  
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
});

// Indexes
leadSchema.index({ owner: 1, status: 1 });
leadSchema.index({ owner: 1, createdAt: 1 });
leadSchema.index({ owner: 1, source: 1 });
leadSchema.index({ email: 1 });
leadSchema.index({ name: 'text', company: 'text', email: 'text' });
/**
 * Lead Model
 */
const Lead = mongoose.model('Lead', leadSchema);
export default Lead;
