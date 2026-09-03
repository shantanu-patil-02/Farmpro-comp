import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);
import mongoose from 'mongoose';

let isConnected = false;

/**
 * Connect to MongoDB with graceful error handling and fallback
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('Notice: MONGODB_URI is not configured. Running in resilient in-memory fallback mode.');
    return false;
  }

  try {
    // Set connection timeout to 5 seconds to avoid hanging on bad connections
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.warn(`MongoDB connection notice: ${error.message}`);
    console.log('Continuing server operation with in-memory resilient fallback.');
    isConnected = false;
    return false;
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}

export default connectDB;
