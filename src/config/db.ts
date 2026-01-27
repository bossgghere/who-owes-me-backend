import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
  if (!mongoURI) {
    console.warn("⚠️ MONGO_URI not set, skipping DB connection");
    return;
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed", error);
  }
};

export default connectDB;
