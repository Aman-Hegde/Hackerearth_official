import { NextFunction, Request, Response } from "express";
import User, { UserRole } from "../models/user";

export const authorize = (...allowedRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Authentication is required.",
      });
    }

    if (!allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "You do not have permission to access this resource.",
      });
    }

    // Re-check administrative privileges against the account, not a stale JWT.
    if (req.auth.role === "admin") {
      try {
        const account = await User.findById(req.auth.userId)
          .select("role isActive emailVerified").exec();
        if (!account || !account.isActive || !account.emailVerified ||
            !allowedRoles.includes(account.role)) {
          return res.status(403).json({ success: false, code: "FORBIDDEN",
            message: "An active, verified administrator account is required." });
        }
      } catch (error) {
        return next(error);
      }
    }
    return next();
  };
};
