import mongoose from "mongoose";
import * as environments from "./environments.js";
import AppError from "../utils/appError.js";

const connectDB = async () => {
  try {
    await mongoose.connect(environments.MONGO_URL, { connectTimeoutMS: 30000 });
  } catch (error) {
    throw new AppError(`MongoDB connection failed: ${error.message}`, 500);
  }
};
export default connectDB;
