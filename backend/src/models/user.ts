import mongoose, { Document, Model, Schema } from "mongoose";

export const VALID_DOMAINS = ["Web Development", "DSA", "Aptitude"] as const;

export type EnrolledDomain = (typeof VALID_DOMAINS)[number];
export type UserRole = "student" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  branch: string;
  year: number;
  passwordHash: string;
  enrolledDomains: EnrolledDomain[];
  role: UserRole;
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
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
      unique: true,
      lowercase: true,
      trim: true,
    },

    usn: {
      type: String,
      required: [true, "USN is required"],
      unique: true,
      uppercase: true,
      trim: true,
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

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
      index: true,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  (mongoose.models.User as Model<IUser> | undefined) ||
  mongoose.model<IUser>("User", userSchema);

export default User;
