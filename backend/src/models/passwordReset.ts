import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IPasswordReset extends Document {
  userId: Types.ObjectId;
  email: string;
  otpHash: string;
  otpExpiresAt: Date;
  otpAttempts: number;
  resendAvailableAt: Date;
  resetTokenHash?: string;
  resetTokenExpiresAt?: Date;
  passwordChangeAuthorized: boolean;
  createdAt: Date;
  cleanupAt: Date;
}

const passwordResetSchema = new Schema<IPasswordReset>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "User",
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },

    otpHash: {
      type: String,
      required: [true, "OTP hash is required"],
      select: false,
    },

    otpExpiresAt: {
      type: Date,
      required: [true, "OTP expiry is required"],
    },

    otpAttempts: {
      type: Number,
      default: 0,
      min: 0,
    },

    resendAvailableAt: {
      type: Date,
      required: [true, "Resend availability time is required"],
    },

    resetTokenHash: {
      type: String,
      select: false,
    },

    resetTokenExpiresAt: {
      type: Date,
    },

    passwordChangeAuthorized: {
      type: Boolean,
      default: false,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    cleanupAt: {
      type: Date,
      required: [true, "Cleanup time is required"],
    },
  },
  {
    versionKey: false,
  }
);

passwordResetSchema.index({ cleanupAt: 1 }, { expireAfterSeconds: 0 });

const PasswordReset: Model<IPasswordReset> =
  (mongoose.models.PasswordReset as Model<IPasswordReset> | undefined) ||
  mongoose.model<IPasswordReset>("PasswordReset", passwordResetSchema);

export default PasswordReset;
