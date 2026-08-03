import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User, { UserRole } from "../models/user";
import { setAuthCookie } from "../utils/authCookie";
import { generateAuthToken } from "../utils/jwt";

const EMAIL_DOMAIN = "@nmamit.in";

interface LoginRequestBody {
  email?: unknown;
  password?: unknown;
}

const normalizeString = (value: unknown): string => {
  return typeof value === "string" ? value.trim() : "";
};

const invalidCredentialsResponse = (res: Response) => {
  return res.status(401).json({
    success: false,
    code: "INVALID_CREDENTIALS",
    message: "Invalid email or password.",
  });
};

const getRedirectPath = (role: UserRole): string => {
  return role === "admin" ? "/admin/dashboard" : "/student/dashboard";
};

export const loginUser = async (
  req: Request<unknown, unknown, LoginRequestBody>,
  res: Response
) => {
  try {
    const email = normalizeString(req.body.email).toLowerCase();
    const password = normalizeString(req.body.password);

    if (!email || !password || !email.endsWith(EMAIL_DOMAIN)) {
      return invalidCredentialsResponse(res);
    }

    const user = await User.findOne({ email }).select("+passwordHash").exec();

    if (!user) {
      return invalidCredentialsResponse(res);
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return invalidCredentialsResponse(res);
    }

    if (!user.emailVerified) {
      return res.status(403).json({
        success: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before logging in.",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_INACTIVE",
        message: "This account is currently inactive.",
      });
    }

    const token = generateAuthToken({
      userId: user._id.toString(),
      role: user.role,
    });

    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful.",
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
      },
      redirectTo: getRedirectPath(user.role),
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};
