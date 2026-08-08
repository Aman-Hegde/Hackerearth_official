import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { Types } from "mongoose";
import PasswordReset, { IPasswordReset } from "../models/passwordReset";
import User from "../models/user";
import { sendPasswordResetOtp } from "../services/emailService";
import {
  compareOtp,
  createOtpExpiry,
  createResendAvailableAt,
  generateOtp,
  hashOtp,
  MAX_OTP_ATTEMPTS,
  OTP_EXPIRY_MINUTES,
  OTP_RESEND_COOLDOWN_SECONDS,
} from "../utils/otp";
import {
  clearPasswordResetCookie,
  PASSWORD_RESET_COOKIE_NAME,
  setPasswordResetCookie,
} from "../utils/passwordResetCookie";
import {
  createPasswordResetTokenExpiry,
  generatePasswordResetToken,
  hashPasswordResetToken,
} from "../utils/passwordResetToken";

const EMAIL_DOMAIN = "@nmamit.in";
const PASSWORD_SALT_ROUNDS = 12;
const RESET_CLEANUP_MINUTES = 30;
const MAX_PASSWORD_RESET_SENDS_PER_MONTH = 2;
const MONTHLY_LIMIT_MESSAGE =
  "You have reached the maximum of 2 password recovery requests for this month. Please contact the HackerEarth Hub team if you need further assistance.";
const GENERAL_REQUEST_MESSAGE =
  "If an account exists with this email, an OTP has been sent.";
const GENERAL_RESEND_MESSAGE =
  "If an account exists with this email, a new OTP has been sent.";

interface EmailRequestBody {
  email?: unknown;
}

interface VerifyForgotPasswordOtpBody {
  email?: unknown;
  otp?: unknown;
}

interface ChangeForgottenPasswordBody {
  newPassword?: unknown;
  confirmPassword?: unknown;
}

const normalizeString = (value: unknown): string => {
  return typeof value === "string" ? value.trim() : "";
};

const normalizeEmail = (value: unknown): string => {
  return normalizeString(value).toLowerCase();
};

const isNmamitEmail = (email: string): boolean => {
  return email.endsWith(EMAIL_DOMAIN);
};

const createCleanupAt = (): Date => {
  return new Date(Date.now() + RESET_CLEANUP_MINUTES * 60 * 1000);
};

const getCurrentCalendarMonth = (date = new Date()): string => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
  }).formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;

  return `${year}-${month}`;
};

const secondsUntil = (date: Date): number => {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
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

const generalForgotPasswordResponse = (
  res: Response,
  message = GENERAL_REQUEST_MESSAGE
) => {
  return res.status(200).json({
    success: true,
    message,
  });
};

const validateForgotPasswordEmail = (email: string, res: Response) => {
  if (!email || !isNmamitEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "A valid NMAMIT email address is required.",
    });
  }

  return null;
};

const monthlyLimitResponse = (res: Response) => {
  return res.status(429).json({
    success: false,
    code: "PASSWORD_RESET_MONTHLY_LIMIT",
    message: MONTHLY_LIMIT_MESSAGE,
  });
};

const toObjectId = (value: unknown): Types.ObjectId => {
  return value instanceof Types.ObjectId
    ? value
    : new Types.ObjectId(String(value));
};

const reserveMonthlyPasswordResetSend = async (userId: Types.ObjectId) => {
  const currentMonth = getCurrentCalendarMonth();

  return User.findOneAndUpdate(
    {
      _id: userId,
      isActive: true,
      $or: [
        { passwordResetRequestMonth: { $ne: currentMonth } },
        { passwordResetRequestMonth: { $exists: false } },
        { passwordResetRequestCount: { $lt: MAX_PASSWORD_RESET_SENDS_PER_MONTH } },
      ],
    },
    [
      {
        $set: {
          passwordResetRequestMonth: currentMonth,
          passwordResetRequestCount: {
            $cond: [
              { $eq: ["$passwordResetRequestMonth", currentMonth] },
              { $add: [{ $ifNull: ["$passwordResetRequestCount", 0] }, 1] },
              1,
            ],
          },
        },
      },
    ],
    {
      new: true,
      updatePipeline: true,
    }
  )
    .select("passwordResetRequestMonth passwordResetRequestCount")
    .exec();
};

const releaseMonthlyPasswordResetSend = async (userId: Types.ObjectId) => {
  const currentMonth = getCurrentCalendarMonth();

  await User.updateOne(
    {
      _id: userId,
      passwordResetRequestMonth: currentMonth,
      passwordResetRequestCount: { $gt: 0 },
    },
    {
      $inc: { passwordResetRequestCount: -1 },
    }
  );
};

const restorePreviousResetRequest = async (
  email: string,
  previousResetRequest: IPasswordReset | null
) => {
  if (!previousResetRequest) {
    await PasswordReset.deleteOne({ email });
    return;
  }

  await PasswordReset.replaceOne(
    { _id: previousResetRequest._id },
    previousResetRequest.toObject(),
    { runValidators: true }
  );
};

const upsertPasswordResetOtp = async ({
  userId,
  email,
  otpHash,
  otpExpiresAt,
  resendAvailableAt,
  cleanupAt,
}: {
  userId: Types.ObjectId;
  email: string;
  otpHash: string;
  otpExpiresAt: Date;
  resendAvailableAt: Date;
  cleanupAt: Date;
}) => {
  await PasswordReset.findOneAndUpdate(
    { email },
    {
      $set: {
        userId,
        email,
        otpHash,
        otpExpiresAt,
        otpAttempts: 0,
        resendAvailableAt,
        passwordChangeAuthorized: false,
        cleanupAt,
      },
      $unset: {
        resetTokenHash: "",
        resetTokenExpiresAt: "",
      },
      $setOnInsert: {
        createdAt: new Date(),
      },
    },
    {
      upsert: true,
      runValidators: true,
    }
  );
};

export const requestForgotPasswordOtp = async (
  req: Request<unknown, unknown, EmailRequestBody>,
  res: Response
) => {
  try {
    const email = normalizeEmail(req.body.email);
    const emailError = validateForgotPasswordEmail(email, res);

    if (emailError) {
      return emailError;
    }

    const user = await User.findOne({
      email,
      isActive: true,
    }).exec();

    if (!user) {
      return generalForgotPasswordResponse(res);
    }

    const existingReset = await PasswordReset.findOne({ email }).select(
      "+otpHash +resetTokenHash"
    );

    if (existingReset && existingReset.resendAvailableAt > new Date()) {
      return generalForgotPasswordResponse(res);
    }

    const userId = toObjectId(user._id);
    const monthlyReservation = await reserveMonthlyPasswordResetSend(userId);

    if (!monthlyReservation) {
      return monthlyLimitResponse(res);
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const otpExpiresAt = createOtpExpiry();
    const resendAvailableAt = createResendAvailableAt();
    const cleanupAt = createCleanupAt();

    await upsertPasswordResetOtp({
      userId,
      email: user.email,
      otpHash,
      otpExpiresAt,
      resendAvailableAt,
      cleanupAt,
    });

    try {
      await sendPasswordResetOtp({
        to: user.email,
        name: user.name,
        otp,
      });
    } catch {
      await Promise.all([
        releaseMonthlyPasswordResetSend(userId),
        restorePreviousResetRequest(email, existingReset),
      ]);

      return res.status(502).json({
        success: false,
        message: "Unable to send password reset email. Please try again later.",
      });
    }

    return generalForgotPasswordResponse(res);
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const resendForgotPasswordOtp = async (
  req: Request<unknown, unknown, EmailRequestBody>,
  res: Response
) => {
  try {
    const email = normalizeEmail(req.body.email);
    const emailError = validateForgotPasswordEmail(email, res);

    if (emailError) {
      return emailError;
    }

    const resetRequest = await PasswordReset.findOne({ email })
      .select("+otpHash +resetTokenHash")
      .exec();

    if (!resetRequest) {
      return generalForgotPasswordResponse(res, GENERAL_RESEND_MESSAGE);
    }

    if (resetRequest.resendAvailableAt > new Date()) {
      return res.status(429).json({
        success: false,
        code: "OTP_RESEND_COOLDOWN",
        message: "Please wait before requesting another OTP.",
        retryAfterSeconds: secondsUntil(resetRequest.resendAvailableAt),
      });
    }

    const user = await User.findOne({
      _id: resetRequest.userId,
      email,
      isActive: true,
    }).exec();

    if (!user) {
      return generalForgotPasswordResponse(res, GENERAL_RESEND_MESSAGE);
    }

    const userId = toObjectId(user._id);
    const monthlyReservation = await reserveMonthlyPasswordResetSend(userId);

    if (!monthlyReservation) {
      return monthlyLimitResponse(res);
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const otpExpiresAt = createOtpExpiry();
    const resendAvailableAt = createResendAvailableAt();
    const cleanupAt = createCleanupAt();

    await upsertPasswordResetOtp({
      userId,
      email: user.email,
      otpHash,
      otpExpiresAt,
      resendAvailableAt,
      cleanupAt,
    });

    try {
      await sendPasswordResetOtp({
        to: user.email,
        name: user.name,
        otp,
      });
    } catch {
      await Promise.all([
        releaseMonthlyPasswordResetSend(userId),
        restorePreviousResetRequest(email, resetRequest),
      ]);

      return res.status(502).json({
        success: false,
        message: "Unable to send password reset email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: GENERAL_RESEND_MESSAGE,
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
      resendAvailableInSeconds: OTP_RESEND_COOLDOWN_SECONDS,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const verifyForgotPasswordOtp = async (
  req: Request<unknown, unknown, VerifyForgotPasswordOtpBody>,
  res: Response
) => {
  try {
    const email = normalizeEmail(req.body.email);
    const otp = normalizeString(req.body.otp);
    const emailError = validateForgotPasswordEmail(email, res);

    if (emailError) {
      return emailError;
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain exactly six digits.",
      });
    }

    const resetRequest = await PasswordReset.findOne({ email })
      .select("+otpHash")
      .exec();

    if (!resetRequest) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    if (resetRequest.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        code: "OTP_EXPIRED",
        message: "OTP expired. Request a new OTP to continue.",
        canResend: true,
      });
    }

    if (resetRequest.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        code: "OTP_LOCKED",
        message: "Too many incorrect attempts. Request a new OTP to continue.",
        canResend: true,
      });
    }

    const isOtpValid = await compareOtp(otp, resetRequest.otpHash);

    if (!isOtpValid) {
      const updatedResetRequest = await PasswordReset.findOneAndUpdate(
        {
          _id: resetRequest._id,
          otpAttempts: { $lt: MAX_OTP_ATTEMPTS },
        },
        { $inc: { otpAttempts: 1 } },
        { new: true }
      ).select("otpAttempts");

      const attemptCount =
        updatedResetRequest?.otpAttempts ?? MAX_OTP_ATTEMPTS;
      const remainingAttempts = Math.max(0, MAX_OTP_ATTEMPTS - attemptCount);

      if (attemptCount >= MAX_OTP_ATTEMPTS) {
        return res.status(429).json({
          success: false,
          code: "OTP_LOCKED",
          message:
            "Too many incorrect attempts. Request a new OTP to continue.",
          canResend: true,
        });
      }

      return res.status(400).json({
        success: false,
        code: "OTP_INVALID",
        message: "Incorrect OTP.",
        remainingAttempts,
      });
    }

    const resetToken = generatePasswordResetToken();
    const resetTokenHash = hashPasswordResetToken(resetToken);

    await PasswordReset.updateOne(
      { _id: resetRequest._id },
      {
        $set: {
          resetTokenHash,
          resetTokenExpiresAt: createPasswordResetTokenExpiry(),
          passwordChangeAuthorized: true,
          cleanupAt: createCleanupAt(),
          otpExpiresAt: new Date(0),
          otpAttempts: MAX_OTP_ATTEMPTS,
        },
      },
      { runValidators: true }
    );

    setPasswordResetCookie(res, resetToken);

    return res.status(200).json({
      success: true,
      message: "OTP verified. You may now set a new password.",
      passwordChangeAuthorized: true,
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const changeForgottenPassword = async (
  req: Request<unknown, unknown, ChangeForgottenPasswordBody>,
  res: Response
) => {
  try {
    const resetToken =
      typeof req.cookies?.[PASSWORD_RESET_COOKIE_NAME] === "string"
        ? req.cookies[PASSWORD_RESET_COOKIE_NAME]
        : "";

    if (!resetToken) {
      return res.status(401).json({
        success: false,
        code: "PASSWORD_RESET_AUTH_REQUIRED",
        message: "Password reset verification is required.",
      });
    }

    const resetTokenHash = hashPasswordResetToken(resetToken);
    const resetRequest = await PasswordReset.findOne({
      resetTokenHash,
      passwordChangeAuthorized: true,
      resetTokenExpiresAt: { $gt: new Date() },
    })
      .select("+resetTokenHash")
      .exec();

    if (!resetRequest) {
      clearPasswordResetCookie(res);

      return res.status(401).json({
        success: false,
        code: "PASSWORD_RESET_TOKEN_INVALID",
        message: "Password reset token is invalid or expired.",
      });
    }

    const newPassword = normalizeString(req.body.newPassword);
    const confirmPassword = normalizeString(req.body.confirmPassword);

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password are required.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password must match.",
      });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      });
    }

    const user = await User.findById(resetRequest.userId).exec();

    if (!user || !user.isActive) {
      clearPasswordResetCookie(res);

      return res.status(user ? 403 : 401).json({
        success: false,
        code: user ? "ACCOUNT_INACTIVE" : "PASSWORD_RESET_TOKEN_INVALID",
        message: user
          ? "This account is currently inactive."
          : "Password reset token is invalid or expired.",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, PASSWORD_SALT_ROUNDS);

    await User.updateOne({ _id: user._id }, { $set: { passwordHash } });
    await PasswordReset.deleteOne({ _id: resetRequest._id });
    clearPasswordResetCookie(res);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully. Please log in using your new password.",
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};
