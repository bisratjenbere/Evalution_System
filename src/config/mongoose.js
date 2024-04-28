import mongoose from "mongoose";
import * as environments from "./environments.js";

const connectDB = async () => {
  try {
    await mongoose.connect(environments.MONGO_URL, { connectTimeoutMS: 30000 });
    console.info("MongoDB Connection Successfull");
  } catch (error) {
    console.info("MongoDB Connection Failed", error);
    throw error;
  }
};

export default connectDB;
