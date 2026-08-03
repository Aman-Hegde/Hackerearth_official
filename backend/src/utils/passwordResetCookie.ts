import { Response } from "express";

export const PASSWORD_RESET_COOKIE_NAME = "password_reset_token";

const PASSWORD_RESET_COOKIE_MAX_AGE_MS = 10 * 60 * 1000;
const PASSWORD_RESET_COOKIE_PATH = "/api/auth/forgot-password";

const isProduction = (): boolean => process.env.NODE_ENV === "production";

const getPasswordResetCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? ("none" as const) : ("lax" as const),
  maxAge: PASSWORD_RESET_COOKIE_MAX_AGE_MS,
  path: PASSWORD_RESET_COOKIE_PATH,
});

export const setPasswordResetCookie = (
  res: Response,
  token: string
): void => {
  res.cookie(PASSWORD_RESET_COOKIE_NAME, token, getPasswordResetCookieOptions());
};

export const clearPasswordResetCookie = (res: Response): void => {
  res.clearCookie(PASSWORD_RESET_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: PASSWORD_RESET_COOKIE_PATH,
  });
};
