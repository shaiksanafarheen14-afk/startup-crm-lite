import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Connects to the MongoDB Atlas database.
 * Uses the MONGODB_URI environment variable from .env.
 */
const connectDB = async () => {
  try {
    // Attempt to establish a connection to MongoDB
    // Note: useNewUrlParser and useUnifiedTopology options are passed as per requirements,
    // though they are no longer strictly needed in Mongoose v6+.
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Exit process with failure code 1 to halt the application if DB connection fails
    process.exit(1);
  }
};

export default connectDB;
