import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/user";
import PendingRegistration from "../models/pendingRegistration";
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
import { sendRegistrationOtpEmail } from "../services/emailService";
import { EnrolledDomain, VALID_DOMAINS } from "../models/user";

const PASSWORD_SALT_ROUNDS = 12;
const EMAIL_DOMAIN = "@nmamit.in";

interface RegistrationRequestBody {
  name?: unknown;
  email?: unknown;
  usn?: unknown;
  contactNumber?: unknown;
  branch?: unknown;
  year?: unknown;
  password?: unknown;
  confirmPassword?: unknown;
  enrolledDomains?: unknown;
}

interface VerifyOtpRequestBody {
  email?: unknown;
  otp?: unknown;
}

interface ResendOtpRequestBody {
  email?: unknown;
}

interface NormalizedRegistrationInput {
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  branch: string;
  year: number;
  password: string;
  enrolledDomains: EnrolledDomain[];
}

const isString = (value: unknown): value is string => typeof value === "string";

const isValidDomain = (domain: string): domain is EnrolledDomain => {
  return (VALID_DOMAINS as readonly string[]).includes(domain);
};

const normalizeString = (value: unknown): string => {
  return isString(value) ? value.trim() : "";
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

const normalizeRegistrationInput = (
  body: RegistrationRequestBody
): { data?: NormalizedRegistrationInput; message?: string } => {
  const name = normalizeString(body.name);
  const email = normalizeString(body.email).toLowerCase();
  const usn = normalizeString(body.usn).toUpperCase();
  const contactNumber = normalizeString(body.contactNumber);
  const branch = normalizeString(body.branch);
  const password = normalizeString(body.password);
  const confirmPassword = normalizeString(body.confirmPassword);
  const year = Number(body.year);

  if (
    !name ||
    !email ||
    !usn ||
    !contactNumber ||
    !branch ||
    !password ||
    !confirmPassword ||
    body.year === undefined ||
    body.enrolledDomains === undefined
  ) {
    return { message: "All registration fields are required." };
  }

  if (!email.endsWith(EMAIL_DOMAIN)) {
    return { message: "Only official @nmamit.in email addresses may register." };
  }

  if (!/^\d{10}$/.test(contactNumber)) {
    return { message: "Contact number must contain exactly 10 digits." };
  }

  if (!Number.isInteger(year) || year < 1 || year > 4) {
    return { message: "Year must be an integer from 1 to 4." };
  }

  if (password !== confirmPassword) {
    return { message: "Password and confirm password must match." };
  }

  if (!isStrongPassword(password)) {
    return {
      message:
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    };
  }

  if (!Array.isArray(body.enrolledDomains) || body.enrolledDomains.length === 0) {
    return { message: "At least one enrolled domain must be selected." };
  }

  const enrolledDomains = Array.from(
    new Set(body.enrolledDomains.filter(isString).map((domain) => domain.trim()))
  );

  if (
    enrolledDomains.length === 0 ||
    enrolledDomains.some((domain) => !isValidDomain(domain))
  ) {
    return { message: "Enrolled domains contain an invalid value." };
  }

  return {
    data: {
      name,
      email,
      usn,
      contactNumber,
      branch,
      year,
      password,
      enrolledDomains: enrolledDomains as EnrolledDomain[],
    },
  };
};

const getDuplicateKeyMessage = (error: unknown): string | null => {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    const keyPattern =
      "keyPattern" in error && typeof error.keyPattern === "object"
        ? error.keyPattern
        : null;

    if (keyPattern && "email" in keyPattern) {
      return "Email is already registered.";
    }

    if (keyPattern && "usn" in keyPattern) {
      return "USN is already registered.";
    }

    return "A registration already exists for these details.";
  }

  return null;
};

const secondsUntil = (date: Date): number => {
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 1000));
};

export const registerStudent = async (
  req: Request<unknown, unknown, RegistrationRequestBody>,
  res: Response
) => {
  try {
    const normalized = normalizeRegistrationInput(req.body);

    if (!normalized.data) {
      return res.status(400).json({
        success: false,
        message: normalized.message,
      });
    }

    const registration = normalized.data;

    const existingUser = await User.findOne({
      $or: [{ email: registration.email }, { usn: registration.usn }],
    })
      .select("email usn")
      .lean();

    if (existingUser?.email === registration.email) {
      return res.status(409).json({
        success: false,
        code: "EMAIL_ALREADY_REGISTERED",
        message: "Email is already registered.",
      });
    }

    if (existingUser?.usn === registration.usn) {
      return res.status(409).json({
        success: false,
        code: "USN_ALREADY_REGISTERED",
        message: "USN is already registered.",
      });
    }

    const passwordHash = await bcrypt.hash(
      registration.password,
      PASSWORD_SALT_ROUNDS
    );

    const user = await User.create({
      name: registration.name,
      email: registration.email,
      usn: registration.usn,
      contactNumber: registration.contactNumber,
      branch: registration.branch,
      year: registration.year,
      passwordHash,
      enrolledDomains: registration.enrolledDomains,
      role: "student",
      emailVerified: true,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully. You can now log in.",
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
  } catch (error) {
    const duplicateMessage = getDuplicateKeyMessage(error);

    if (duplicateMessage) {
      return res.status(409).json({
        success: false,
        code:
          duplicateMessage === "Email is already registered."
            ? "EMAIL_ALREADY_REGISTERED"
            : duplicateMessage === "USN is already registered."
              ? "USN_ALREADY_REGISTERED"
              : "REGISTRATION_ALREADY_EXISTS",
        message: duplicateMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const requestRegistrationOtp = async (
  req: Request<unknown, unknown, RegistrationRequestBody>,
  res: Response
) => {
  try {
    const normalized = normalizeRegistrationInput(req.body);

    if (!normalized.data) {
      return res.status(400).json({
        success: false,
        message: normalized.message,
      });
    }

    const registration = normalized.data;

    const existingUser = await User.findOne({
      $or: [{ email: registration.email }, { usn: registration.usn }],
    })
      .select("email usn")
      .lean();

    if (existingUser?.email === registration.email) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    if (existingUser?.usn === registration.usn) {
      return res.status(409).json({
        success: false,
        message: "USN is already registered.",
      });
    }

    const existingPendingRegistration = await PendingRegistration.findOne({
      $or: [{ email: registration.email }, { usn: registration.usn }],
    }).select("resendAvailableAt");

    if (
      existingPendingRegistration &&
      existingPendingRegistration.resendAvailableAt > new Date()
    ) {
      return res.status(429).json({
        success: false,
        code: "OTP_RESEND_COOLDOWN",
        message: "Please wait before requesting another OTP.",
        retryAfterSeconds: secondsUntil(
          existingPendingRegistration.resendAvailableAt
        ),
      });
    }

    const otp = generateOtp();
    const [passwordHash, otpHash] = await Promise.all([
      bcrypt.hash(registration.password, PASSWORD_SALT_ROUNDS),
      hashOtp(otp),
    ]);

    const pendingRegistration = await PendingRegistration.findOneAndReplace(
      {
        $or: [{ email: registration.email }, { usn: registration.usn }],
      },
      {
        name: registration.name,
        email: registration.email,
        usn: registration.usn,
        contactNumber: registration.contactNumber,
        branch: registration.branch,
        year: registration.year,
        passwordHash,
        enrolledDomains: registration.enrolledDomains,
        otpHash,
        otpExpiresAt: createOtpExpiry(),
        otpAttempts: 0,
        resendAvailableAt: createResendAvailableAt(),
        createdAt: new Date(),
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    try {
      await sendRegistrationOtpEmail({
        recipientEmail: registration.email,
        recipientName: registration.name,
        otp,
      });
    } catch {
      await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

      return res.status(502).json({
        success: false,
        message: "Unable to send verification email. Please try again later.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent to your NMAMIT email address",
      email: registration.email,
      expiresInSeconds: OTP_EXPIRY_MINUTES * 60,
      resendAvailableInSeconds: OTP_RESEND_COOLDOWN_SECONDS,
    });
  } catch (error) {
    const duplicateMessage = getDuplicateKeyMessage(error);

    if (duplicateMessage) {
      return res.status(409).json({
        success: false,
        message: duplicateMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const verifyRegistrationOtp = async (
  req: Request<unknown, unknown, VerifyOtpRequestBody>,
  res: Response
) => {
  try {
    const email = normalizeString(req.body.email).toLowerCase();
    const otp = normalizeString(req.body.otp);

    if (!email || !email.endsWith(EMAIL_DOMAIN)) {
      return res.status(400).json({
        success: false,
        message: "A valid NMAMIT email address is required.",
      });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({
        success: false,
        message: "OTP must contain exactly six digits.",
      });
    }

    const pendingRegistration = await PendingRegistration.findOne({ email })
      .select("+otpHash +passwordHash")
      .exec();

    if (!pendingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP.",
      });
    }

    if (pendingRegistration.otpExpiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        code: "OTP_EXPIRED",
        message: "OTP expired. Request a new OTP to continue.",
        canResend: true,
      });
    }

    if (pendingRegistration.otpAttempts >= MAX_OTP_ATTEMPTS) {
      return res.status(429).json({
        success: false,
        code: "OTP_LOCKED",
        message: "Too many incorrect attempts. Request a new OTP to continue.",
        canResend: true,
      });
    }

    const isOtpValid = await compareOtp(otp, pendingRegistration.otpHash);

    if (!isOtpValid) {
      const updatedPendingRegistration =
        await PendingRegistration.findOneAndUpdate(
          {
            _id: pendingRegistration._id,
            otpAttempts: { $lt: MAX_OTP_ATTEMPTS },
          },
          { $inc: { otpAttempts: 1 } },
          { new: true }
        ).select("otpAttempts");

      const attemptCount =
        updatedPendingRegistration?.otpAttempts ?? MAX_OTP_ATTEMPTS;
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

    const existingUser = await User.findOne({
      $or: [
        { email: pendingRegistration.email },
        { usn: pendingRegistration.usn },
      ],
    })
      .select("email usn")
      .lean();

    if (existingUser?.email === pendingRegistration.email) {
      await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    if (existingUser?.usn === pendingRegistration.usn) {
      await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

      return res.status(409).json({
        success: false,
        message: "USN is already registered.",
      });
    }

    const user = await User.create({
      name: pendingRegistration.name,
      email: pendingRegistration.email,
      usn: pendingRegistration.usn,
      contactNumber: pendingRegistration.contactNumber,
      branch: pendingRegistration.branch,
      year: pendingRegistration.year,
      passwordHash: pendingRegistration.passwordHash,
      enrolledDomains: pendingRegistration.enrolledDomains,
      role: "student",
      emailVerified: true,
      isActive: true,
    });

    await PendingRegistration.deleteOne({ _id: pendingRegistration._id });

    return res.status(201).json({
      success: true,
      message: "Email verified and account created successfully",
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
    });
  } catch (error) {
    const duplicateMessage = getDuplicateKeyMessage(error);

    if (duplicateMessage) {
      return res.status(409).json({
        success: false,
        message: duplicateMessage,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const resendRegistrationOtp = async (
  req: Request<unknown, unknown, ResendOtpRequestBody>,
  res: Response
) => {
  try {
    const email = normalizeString(req.body.email).toLowerCase();

    if (!email || !email.endsWith(EMAIL_DOMAIN)) {
      return res.status(400).json({
        success: false,
        message: "A valid NMAMIT email address is required.",
      });
    }

    const pendingRegistration = await PendingRegistration.findOne({
      email,
    }).exec();

    if (!pendingRegistration) {
      return res.status(400).json({
        success: false,
        code: "REGISTRATION_NOT_FOUND",
        message: "No pending registration was found. Please register again.",
      });
    }

    if (pendingRegistration.resendAvailableAt > new Date()) {
      return res.status(429).json({
        success: false,
        code: "OTP_RESEND_COOLDOWN",
        message: "Please wait before requesting another OTP.",
        retryAfterSeconds: secondsUntil(pendingRegistration.resendAvailableAt),
      });
    }

    const otp = generateOtp();
    const otpHash = await hashOtp(otp);
    const otpExpiresAt = createOtpExpiry();
    const resendAvailableAt = createResendAvailableAt();

    try {
      await sendRegistrationOtpEmail({
        recipientEmail: pendingRegistration.email,
        recipientName: pendingRegistration.name,
        otp,
      });
    } catch {
      return res.status(502).json({
        success: false,
        message: "Unable to send verification email. Please try again later.",
      });
    }

    await PendingRegistration.updateOne(
      { _id: pendingRegistration._id },
      {
        $set: {
          otpHash,
          otpExpiresAt,
          otpAttempts: 0,
          resendAvailableAt,
        },
      },
      { runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "A new OTP has been sent to your NMAMIT email address.",
      email: pendingRegistration.email,
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
