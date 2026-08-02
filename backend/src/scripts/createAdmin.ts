import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDatabase } from "../config/db";
import User, { VALID_DOMAINS } from "../models/user";

dotenv.config();

const PASSWORD_SALT_ROUNDS = 12;
const EMAIL_DOMAIN = "@nmamit.in";

interface AdminInput {
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  branch: string;
  year: number;
  password?: string;
}

const getEnvString = (key: string): string => {
  return process.env[key]?.trim() ?? "";
};

const isStrongPassword = (password: string): boolean => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
};

const readAdminInput = (): AdminInput => {
  const name = getEnvString("ADMIN_NAME");
  const email = getEnvString("ADMIN_EMAIL").toLowerCase();
  const usn = getEnvString("ADMIN_USN").toUpperCase();
  const contactNumber = getEnvString("ADMIN_CONTACT_NUMBER");
  const branch = getEnvString("ADMIN_BRANCH");
  const yearRaw = getEnvString("ADMIN_YEAR");
  const password = getEnvString("ADMIN_PASSWORD");
  const year = Number(yearRaw);

  if (!name || !email || !usn || !contactNumber || !branch || !yearRaw) {
    throw new Error("ADMIN_NAME, ADMIN_EMAIL, ADMIN_USN, ADMIN_CONTACT_NUMBER, ADMIN_BRANCH, and ADMIN_YEAR are required.");
  }

  if (!email.endsWith(EMAIL_DOMAIN)) {
    throw new Error("ADMIN_EMAIL must be an official @nmamit.in email address.");
  }

  if (!/^\d{10}$/.test(contactNumber)) {
    throw new Error("ADMIN_CONTACT_NUMBER must contain exactly 10 digits.");
  }

  if (!Number.isInteger(year) || year < 1 || year > 4) {
    throw new Error("ADMIN_YEAR must be an integer from 1 to 4.");
  }

  if (password && !isStrongPassword(password)) {
    throw new Error("ADMIN_PASSWORD must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.");
  }

  const input: AdminInput = {
    name,
    email,
    usn,
    contactNumber,
    branch,
    year,
  };

  if (password) {
    input.password = password;
  }

  return input;
};

const createOrPromoteAdmin = async (): Promise<void> => {
  const input = readAdminInput();

  await connectDatabase();

  const existingUser = await User.findOne({
    $or: [{ email: input.email }, { usn: input.usn }],
  }).exec();

  if (existingUser) {
    existingUser.name = input.name;
    existingUser.email = input.email;
    existingUser.usn = input.usn;
    existingUser.contactNumber = input.contactNumber;
    existingUser.branch = input.branch;
    existingUser.year = input.year;
    existingUser.role = "admin";
    existingUser.emailVerified = true;
    existingUser.isActive = true;

    if (input.password) {
      existingUser.passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
    }

    await existingUser.save();

    console.log("Admin account promoted or updated successfully.");
    console.log(`Admin: ${existingUser.name} <${existingUser.email}> (${existingUser.usn})`);
    return;
  }

  if (!input.password) {
    throw new Error("ADMIN_PASSWORD is required when creating a new admin account.");
  }

  const passwordHash = await bcrypt.hash(input.password, PASSWORD_SALT_ROUNDS);
  const admin = await new User({
    name: input.name,
    email: input.email,
    usn: input.usn,
    contactNumber: input.contactNumber,
    branch: input.branch,
    year: input.year,
    passwordHash,
    enrolledDomains: [...VALID_DOMAINS],
    role: "admin",
    emailVerified: true,
    isActive: true,
  }).save();

  console.log("Admin account created successfully.");
  console.log(`Admin: ${admin.name} <${admin.email}> (${admin.usn})`);
};

const run = async (): Promise<void> => {
  try {
    await createOrPromoteAdmin();
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    await mongoose.disconnect().catch(() => undefined);
    const message = error instanceof Error ? error.message : "Failed to create admin.";
    console.error(message);
    process.exit(1);
  }
};

void run();
