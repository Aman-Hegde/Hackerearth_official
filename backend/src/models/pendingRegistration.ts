import mongoose, { Document, Model, Schema } from "mongoose";
import { VALID_DOMAINS, EnrolledDomain } from "./user";

export interface IPendingRegistration extends Document {
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  branch: string;
  year: number;
  passwordHash: string;
  enrolledDomains: EnrolledDomain[];
  otpHash: string;
  otpExpiresAt: Date;
  otpAttempts: number;
  resendAvailableAt: Date;
  createdAt: Date;
}

const pendingRegistrationSchema = new Schema<IPendingRegistration>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },

    usn: {
      type: String,
      required: [true, "USN is required"],
      uppercase: true,
      trim: true,
      unique: true,
    },

    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
      match: [/^\d{10}$/, "Contact number must contain exactly 10 digits"],
    },

    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },

    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1, "Year must be between 1 and 4"],
      max: [4, "Year must be between 1 and 4"],
      validate: {
        validator: Number.isInteger,
        message: "Year must be an integer",
      },
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    enrolledDomains: {
      type: [String],
      required: [true, "At least one enrolled domain is required"],
      enum: VALID_DOMAINS,
      validate: {
        validator: (domains: EnrolledDomain[]) => domains.length > 0,
        message: "At least one enrolled domain is required",
      },
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

    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
  },
  {
    versionKey: false,
  }
);

pendingRegistrationSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingRegistration: Model<IPendingRegistration> =
  (mongoose.models.PendingRegistration as
    | Model<IPendingRegistration>
    | undefined) ||
  mongoose.model<IPendingRegistration>(
    "PendingRegistration",
    pendingRegistrationSchema
  );

export default PendingRegistration;
