import { createHash, randomBytes } from "crypto";

const PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 10;

export const generatePasswordResetToken = (): string => {
  return randomBytes(32).toString("base64url");
};

export const hashPasswordResetToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const createPasswordResetTokenExpiry = (): Date => {
  return new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
};
