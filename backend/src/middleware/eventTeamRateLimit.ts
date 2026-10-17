import { NextFunction, Request, Response } from "express";

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

interface PublicRateLimitOptions {
  bucketName: string;
  windowMs: number;
  maxRequests: number;
  message: string;
}

const buckets = new Map<string, RateLimitBucket>();

const pruneExpiredBuckets = (now: number) => {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
};

const createPublicRateLimit = ({
  bucketName,
  windowMs,
  maxRequests,
  message,
}: PublicRateLimitOptions) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (req.auth) return next();

    const now = Date.now();
    pruneExpiredBuckets(now);
    const client = req.ip || req.socket.remoteAddress || "unknown";
    const eventId = req.params.eventId ?? "unknown-event";
    const key = `${bucketName}:${client}:${eventId}`;
    const current = buckets.get(key);

    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (current.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((current.resetAt - now) / 1000);
      res.setHeader("Retry-After", String(retryAfterSeconds));
      return res.status(429).json({
        success: false,
        code: "RATE_LIMITED",
        message,
        retryAfterSeconds,
      });
    }

    current.count += 1;
    return next();
  };

export const publicTeamRegistrationRateLimit = createPublicRateLimit({
  bucketName: "event-team-registration",
  windowMs: 15 * 60 * 1000,
  maxRequests: 20,
  message: "Too many team registration attempts. Please try again later.",
});

export const invitationPreviewRateLimit = createPublicRateLimit({
  bucketName: "event-team-invitation-preview",
  windowMs: 5 * 60 * 1000,
  maxRequests: 60,
  message: "Too many invitation checks. Please try again later.",
});
