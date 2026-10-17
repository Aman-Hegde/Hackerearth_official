import mongoose from "mongoose";
import {
  assertVerifiedLocalTestMode,
  isLocalTestEnvironmentLoaded,
} from "./localTestEnvironment";

export const connectDatabase = async (): Promise<void> => {
  assertVerifiedLocalTestMode(
    process.env,
    isLocalTestEnvironmentLoaded()
  );

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined in the environment variables.");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    if (process.env.LOCAL_TEST_MODE === "true") {
      console.error("Local test MongoDB connection failed.");
    } else {
      console.error("MongoDB connection failed:", error);
    }
    throw error;
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected.");
});
