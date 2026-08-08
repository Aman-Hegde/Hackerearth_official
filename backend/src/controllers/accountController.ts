import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import { clearAuthCookie } from "../utils/authCookie";

const PASSWORD_SALT_ROUNDS = 12;

interface ChangePasswordBody {
  currentPassword?: unknown;
  newPassword?: unknown;
  confirmPassword?: unknown;
}

const normalizeString = (value: unknown): string => {
  return typeof value === "string" ? value.trim() : "";
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

export const changePassword = async (
  req: Request<unknown, unknown, ChangePasswordBody>,
  res: Response
) => {
  try {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Authentication is required.",
      });
    }

    const currentPassword = normalizeString(req.body.currentPassword);
    const newPassword = normalizeString(req.body.newPassword);
    const confirmPassword = normalizeString(req.body.confirmPassword);

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        code: "VALIDATION_ERROR",
        message: "Current password, new password, and confirmation are required.",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        code: "PASSWORD_WEAK",
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        code: "PASSWORD_MISMATCH",
        message: "New password and confirmation do not match.",
      });
    }

    const user = await User.findById(req.auth.userId)
      .select("+passwordHash")
      .exec();

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid authentication token.",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        code: "CURRENT_PASSWORD_INCORRECT",
        message: "Current password is incorrect.",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        code: "PASSWORD_UNCHANGED",
        message: "New password must be different from your current password.",
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);
    await user.save();

    clearAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully. Please log in again with your new password.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};
