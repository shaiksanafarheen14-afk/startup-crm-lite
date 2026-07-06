import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * User Schema Definition
 */
export const userSchema = new mongoose.Schema(
  {
    /**
     * User's full name.
     * @type {String}
     */
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minLength: [2, 'Name must be at least 2 characters long'],
      maxLength: [50, 'Name cannot exceed 50 characters'],
    },
    /**
     * User's email address. Used for authentication and communication.
     * @type {String}
     */
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    /**
     * User's hashed password.
     * @type {String}
     */
    password: {
      type: String,
      required: [true, 'Password is required'],
      minLength: [6, 'Password must be at least 6 characters long'],
    },
    /**
     * User's role in the system. Determines access permissions.
     * @type {String}
     */
    role: {
      type: String,
      enum: {
        values: ['admin', 'user'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
    /**
     * Indicates whether the user account is currently active.
     * @type {Boolean}
     */
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to hash password before saving
userSchema.pre('save', async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Override toJSON to remove password field from responses
userSchema.set('toJSON', {
  transform: function (doc, ret, options) {
    delete ret.password;
    return ret;
  },
});

/**
 * User Model
 */
const User = mongoose.model('User', userSchema);
export default User;
