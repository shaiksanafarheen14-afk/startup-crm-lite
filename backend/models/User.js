import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema definition
 */
export const userSchema = new mongoose.Schema({
  /**
   * User's full name
   * Must be between 2 and 50 characters
   */
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minLength: [2, 'Name must be at least 2 characters long'],
    maxLength: [50, 'Name cannot exceed 50 characters']
  },
  /**
   * User's email address
   * Must be unique and properly formatted
   */
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
  },
  /**
   * User's password
   * Will be hashed before saving, minimum 6 characters
   */
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, 'Password must be at least 6 characters long']
  },
  /**
   * User's role in the system
   * Can be either 'admin' or 'user'
   */
  role: {
    type: String,
    enum: {
      values: ['admin', 'user'],
      message: '{VALUE} is not a supported role'
    },
    default: 'user'
  },
  /**
   * Flag indicating if the user account is active
   */
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt fields
});

/**
 * Pre-save middleware to hash the password before saving
 */
userSchema.pre('save', async function () {
  // Only hash the password if it hasn't changed
  if (!this.isModified('password')) {
    return;
  }

  // Generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Instance method to compare plain text password with hashed password
 * @param {string} candidatePassword - The plain text password to check
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

/**
 * Override toJSON method to remove sensitive fields like password
 * from the returned object when converting to JSON (e.g., in responses)
 */
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);
export default User;
