import { Request, Response } from "express";
import User from "../models/user";
import { clearAuthCookie } from "../utils/authCookie";

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Authentication is required.",
      });
    }

    const user = await User.findById(req.auth.userId).exec();

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid authentication token.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_INACTIVE",
        message: "This account is currently inactive.",
      });
    }

    return res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        usn: user.usn,
        contactNumber: user.contactNumber,
        branch: user.branch,
        year: user.year,
        enrolledDomains: user.enrolledDomains,
        role: user.role,
        emailVerified: user.emailVerified,
        isActive: user.isActive,
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const logoutUser = (_req: Request, res: Response) => {
  clearAuthCookie(res);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
};
