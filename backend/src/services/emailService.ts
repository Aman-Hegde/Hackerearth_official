import nodemailer, { Transporter } from "nodemailer";
import { OTP_EXPIRY_MINUTES } from "../utils/otp";

interface RegistrationOtpEmailInput {
  recipientEmail: string;
  recipientName: string;
  otp: string;
}

interface PasswordResetOtpEmailInput {
  recipientEmail: string;
  recipientName: string;
  otp: string;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromName: string;
  fromAddress: string;
}

const requiredEnvVars = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_SECURE",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "EMAIL_FROM_NAME",
  "EMAIL_FROM_ADDRESS",
] as const;

let transporter: Transporter | null = null;

const getRequiredEnv = (key: (typeof requiredEnvVars)[number]): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required for SMTP email delivery.`);
  }

  return value;
};

const parseSmtpConfig = (): SmtpConfig => {
  const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing SMTP environment variables: ${missingVars.join(", ")}`
    );
  }

  const port = Number(getRequiredEnv("SMTP_PORT"));

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP_PORT must be a positive integer.");
  }

  const secureValue = getRequiredEnv("SMTP_SECURE").toLowerCase();

  if (!["true", "false"].includes(secureValue)) {
    throw new Error("SMTP_SECURE must be either true or false.");
  }

  return {
    host: getRequiredEnv("SMTP_HOST"),
    port,
    secure: secureValue === "true",
    user: getRequiredEnv("SMTP_USER"),
    password: getRequiredEnv("SMTP_PASSWORD"),
    fromName: getRequiredEnv("EMAIL_FROM_NAME"),
    fromAddress: getRequiredEnv("EMAIL_FROM_ADDRESS"),
  };
};

const getTransporter = (): Transporter => {
  if (transporter) {
    return transporter;
  }

  const config = parseSmtpConfig();

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  return transporter;
};

const escapeHtml = (value: string): string => {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] ?? character;
  });
};

export const verifyEmailTransport = async (): Promise<void> => {
  await getTransporter().verify();
  console.log("SMTP configuration is valid.");
};

export const sendRegistrationOtpEmail = async ({
  recipientEmail,
  recipientName,
  otp,
}: RegistrationOtpEmailInput): Promise<void> => {
  const config = parseSmtpConfig();
  const safeRecipientName = escapeHtml(recipientName);

  await getTransporter().sendMail({
    from: {
      name: config.fromName,
      address: config.fromAddress,
    },
    to: {
      name: recipientName,
      address: recipientEmail,
    },
    subject: "HackerEarth Hub NMAMIT - Verify Your Email",
    text: [
      `Hi ${recipientName},`,
      "",
      `Your HackerEarth Hub NMAMIT registration OTP is ${otp}.`,
      `This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      "",
      "Do not share this OTP with anyone.",
      "If you did not request registration, please ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <p>Hi ${safeRecipientName},</p>
        <p>Your HackerEarth Hub NMAMIT registration OTP is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
        <p>This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>Do not share this OTP with anyone.</p>
        <p>If you did not request registration, please ignore this email.</p>
      </div>
    `,
  });
};

export const sendPasswordResetOtpEmail = async ({
  recipientEmail,
  recipientName,
  otp,
}: PasswordResetOtpEmailInput): Promise<void> => {
  const config = parseSmtpConfig();
  const safeRecipientName = escapeHtml(recipientName);

  await getTransporter().sendMail({
    from: {
      name: config.fromName,
      address: config.fromAddress,
    },
    to: {
      name: recipientName,
      address: recipientEmail,
    },
    subject: "HackerEarth Hub NMAMIT - Password Reset OTP",
    text: [
      `Hi ${recipientName},`,
      "",
      `Your HackerEarth Hub NMAMIT password reset OTP is ${otp}.`,
      `This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      "",
      "Do not share this OTP with anyone.",
      "If you did not request a password change, please ignore this email.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <p>Hi ${safeRecipientName},</p>
        <p>Your HackerEarth Hub NMAMIT password reset OTP is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
        <p>This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>Do not share this OTP with anyone.</p>
        <p>If you did not request a password change, please ignore this email.</p>
      </div>
    `,
  });
};
