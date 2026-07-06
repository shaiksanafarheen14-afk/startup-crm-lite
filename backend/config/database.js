import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Connects to MongoDB Atlas using the URI from environment variables.
 * Exits the process if the connection fails.
 */
export const connectDB = async () => {
  try {
    // Note: useNewUrlParser and useUnifiedTopology are deprecated in Mongoose 6+,
    // but included as requested in the requirements.
    const conn = await mongoose.connect(process.env.MONGODB_URI);
  
    
    console.log(`MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};
