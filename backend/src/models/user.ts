import mongoose, { Document, Schema } from "mongoose";

export type UserRole = "student" | "admin";

export interface IUser extends Document {
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  passwordHash: string;
  preferredDomains: string[];
  role: UserRole;
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
    },

    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },

    preferredDomains: {
      type: [String],
      default: [],
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
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

const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;