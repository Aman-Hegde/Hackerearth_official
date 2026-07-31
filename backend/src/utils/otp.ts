import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

const OTP_SALT_ROUNDS = 10;

export const OTP_EXPIRY_MINUTES = 10;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;
export const MAX_OTP_ATTEMPTS = 5;

export const generateOtp = (): string => {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
};

export const hashOtp = async (otp: string): Promise<string> => {
  return bcrypt.hash(otp, OTP_SALT_ROUNDS);
};

export const compareOtp = async (
  otp: string,
  otpHash: string
): Promise<boolean> => {
  return bcrypt.compare(otp, otpHash);
};

export const createOtpExpiry = (): Date => {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
};

export const createResendAvailableAt = (): Date => {
  return new Date(Date.now() + OTP_RESEND_COOLDOWN_SECONDS * 1000);
};
