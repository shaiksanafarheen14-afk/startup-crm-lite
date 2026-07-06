import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = generateToken(user._id);

    // User model's toJSON method automatically removes the password
    res.status(201).json({
      success: true,
      token,
      user
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // TODO: Add express-rate-limit to this route in production to prevent brute force attacks

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated' });
    }

    const token = generateToken(user._id);

    // Remove password before sending response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json({
      success: true,
      token,
      user: userResponse
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, password, oldPassword } = req.body;
    
    const user = await User.findById(req.user._id).select('+password');

    if (name) {
      user.name = name;
    }

    if (password) {
      if (!oldPassword) {
         return res.status(400).json({ success: false, message: 'Please provide old password to set a new password' });
      }
      
      const isMatch = await user.comparePassword(oldPassword);
      if (!isMatch) {
         return res.status(401).json({ success: false, message: 'Old password is incorrect' });
      }
      
      user.password = password; // pre-save hook handles hashing
    }

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.password;

    res.status(200).json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};
