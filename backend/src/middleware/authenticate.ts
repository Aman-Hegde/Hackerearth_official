import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME } from "../utils/authCookie";
import { verifyAuthToken } from "../utils/jwt";

const getBearerToken = (authorizationHeader: string | undefined): string => {
  if (!authorizationHeader) {
    return "";
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return "";
  }

  return token;
};

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieToken =
    typeof req.cookies?.[AUTH_COOKIE_NAME] === "string"
      ? req.cookies[AUTH_COOKIE_NAME]
      : "";
  const bearerToken = getBearerToken(req.headers.authorization);
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      code: "AUTH_REQUIRED",
      message: "Authentication is required.",
    });
  }

  try {
    req.auth = verifyAuthToken(token);
    return next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        code: "TOKEN_EXPIRED",
        message: "Your session has expired. Please log in again.",
      });
    }

    return res.status(401).json({
      success: false,
      code: "INVALID_TOKEN",
      message: "Invalid authentication token.",
    });
  }
};
