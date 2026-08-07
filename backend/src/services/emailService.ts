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

interface PasswordResetOtpInput {
  to: string;
  name: string;
  otp: string;
}

interface BrevoConfig {
  apiKey: string;
  fromName: string;
  fromAddress: string;
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

const requiredBrevoEnvVars = [
  "BREVO_API_KEY",
  "EMAIL_FROM_NAME",
  "EMAIL_FROM_ADDRESS",
] as const;

const BREVO_TRANSACTIONAL_EMAIL_URL =
  "https://api.brevo.com/v3/smtp/email";

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
      "Your HackerEarth Hub NMAMIT password reset OTP is:",
      "",
      otp,
      "",
      `This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.`,
      "",
      "If you did not request a password reset, please ignore this email.",
      "",
      "Do not share this OTP with anyone.",
      "",
      "HackerEarth Hub NMAMIT",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6;">
        <p>Hi ${safeRecipientName},</p>
        <p>Your HackerEarth Hub NMAMIT password reset OTP is:</p>
        <p style="font-size: 24px; font-weight: 700; letter-spacing: 6px;">${otp}</p>
        <p>This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
        <p>Do not share this OTP with anyone.</p>
        <p>HackerEarth Hub NMAMIT</p>
      </div>
    `,
  });
};

const getRequiredBrevoEnv = (
  key: (typeof requiredBrevoEnvVars)[number]
): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is required for Brevo email delivery.`);
  }

  return value;
};

const parseBrevoConfig = (): BrevoConfig => {
  const missingVars = requiredBrevoEnvVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing Brevo environment variables: ${missingVars.join(", ")}`
    );
  }

  return {
    apiKey: getRequiredBrevoEnv("BREVO_API_KEY"),
    fromName: getRequiredBrevoEnv("EMAIL_FROM_NAME"),
    fromAddress: getRequiredBrevoEnv("EMAIL_FROM_ADDRESS"),
  };
};

const getEmailProvider = (): string => {
  return (process.env.EMAIL_PROVIDER ?? "brevo").trim().toLowerCase();
};

export const sendPasswordResetOtp = async ({
  to,
  name,
  otp,
}: PasswordResetOtpInput): Promise<void> => {
  const provider = getEmailProvider();

  if (provider !== "brevo") {
    throw new Error(`Unsupported email provider: ${provider}`);
  }

  const config = parseBrevoConfig();
  const safeRecipientName = escapeHtml(name);
  const textContent = [
    `Hi ${name},`,
    "",
    "Your HackerEarth Hub NMAMIT password reset OTP is:",
    "",
    otp,
    "",
    `This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.`,
    "",
    "Do not share this OTP with anyone.",
    "",
    "If you did not request a password reset, please ignore this email.",
    "",
    "HackerEarth Hub NMAMIT",
  ].join("\n");
  const htmlContent = `
    <div style="margin:0; padding:0; background:#f8fafc; font-family:Arial, sans-serif; color:#0f172a;">
      <div style="max-width:560px; margin:0 auto; padding:32px 20px;">
        <div style="border:1px solid #dbeafe; border-radius:18px; overflow:hidden; background:#ffffff;">
          <div style="background:#0f172a; padding:22px 24px; color:#ffffff;">
            <p style="margin:0; font-size:12px; letter-spacing:1.8px; text-transform:uppercase; color:#93c5fd;">HackerEarth Hub NMAMIT</p>
            <h1 style="margin:8px 0 0; font-size:22px; line-height:1.3;">Password Reset OTP</h1>
          </div>
          <div style="padding:24px;">
            <p style="margin:0 0 16px;">Hi ${safeRecipientName},</p>
            <p style="margin:0 0 12px;">Your HackerEarth Hub NMAMIT password reset OTP is:</p>
            <p style="margin:0 0 18px; display:inline-block; padding:14px 18px; border-radius:12px; background:#eff6ff; border:1px solid #bfdbfe; color:#1d4ed8; font-size:28px; font-weight:700; letter-spacing:7px;">${otp}</p>
            <p style="margin:0 0 12px;">This OTP expires in ${OTP_EXPIRY_MINUTES} minutes.</p>
            <p style="margin:0 0 12px;">Do not share this OTP with anyone.</p>
            <p style="margin:0 0 20px; color:#475569;">If you did not request a password reset, please ignore this email.</p>
            <p style="margin:0; font-weight:700;">HackerEarth Hub NMAMIT</p>
          </div>
        </div>
      </div>
    </div>
  `;

  let response: Response;

  try {
    response = await fetch(BREVO_TRANSACTIONAL_EMAIL_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": config.apiKey,
      },
      body: JSON.stringify({
        sender: {
          name: config.fromName,
          email: config.fromAddress,
        },
        to: [
          {
            email: to,
            name,
          },
        ],
        subject: "HackerEarth Hub NMAMIT - Password Reset OTP",
        htmlContent,
        textContent,
      }),
    });
  } catch {
    throw new Error("Brevo password reset email request failed.");
  }

  if (!response.ok) {
    throw new Error(
      `Brevo password reset email delivery failed with status ${response.status}.`
    );
  }
};
