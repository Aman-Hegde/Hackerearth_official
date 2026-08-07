import { NextFunction, Request, Response } from "express";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 10;
const buckets = new Map<string, RateLimitBucket>();

const getClientKey = (req: Request): string => {
  return req.ip || req.socket.remoteAddress || "unknown";
};

export const forgotPasswordRateLimit = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const now = Date.now();
  const key = getClientKey(req);
  const currentBucket = buckets.get(key);

  if (!currentBucket || currentBucket.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return next();
  }

  if (currentBucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      code: "RATE_LIMITED",
      message: "Too many password reset requests. Please try again later.",
      retryAfterSeconds: Math.ceil((currentBucket.resetAt - now) / 1000),
    });
  }

  currentBucket.count += 1;
  buckets.set(key, currentBucket);
  return next();
};
