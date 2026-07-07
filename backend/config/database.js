import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Includes retry logic with exponential backoff for Railway deployment environments.
 * @param {number} retries - Number of retry attempts (default: 3)
 */
export const connectDB = async (retries = 3) => {
  const mongooseOptions = {
    // How long to wait for a server to be selected (ms)
    serverSelectionTimeoutMS: 10000,
    // How long to wait for a connection to be established (ms)
    connectTimeoutMS: 10000,
    // How long socket stays open without activity (ms)
    socketTimeoutMS: 45000,
    // Maximum connections in pool
    maxPoolSize: 10,
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
      console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);

      // Log connection lifecycle events
      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  MongoDB disconnected');
      });
      mongoose.connection.on('reconnected', () => {
        console.log('✅ MongoDB reconnected');
      });
      mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err.message);
      });

      return conn;
    } catch (error) {
      console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed: ${error.message}`);

      if (attempt === retries) {
        throw error; // Let caller handle the final failure
      }

      // Exponential backoff: wait 2s, 4s, 8s...
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`⏳ Retrying in ${delay / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
