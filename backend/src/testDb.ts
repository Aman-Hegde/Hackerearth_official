import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "./config/db";

dotenv.config();

const testDatabaseConnection = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log("Database connection test passed.");
  } catch (error) {
    console.error("Database connection test failed.");
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

void testDatabaseConnection();