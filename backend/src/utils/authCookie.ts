import { Response } from "express";

export const AUTH_COOKIE_NAME = "auth_token";

const AUTH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const isProduction = (): boolean => process.env.NODE_ENV === "production";

const getCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? ("none" as const) : ("lax" as const),
  maxAge: AUTH_COOKIE_MAX_AGE_MS,
  path: "/",
});

export const setAuthCookie = (res: Response, token: string): void => {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions());
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? "none" : "lax",
    path: "/",
  });
};
