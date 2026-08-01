import jwt from "jsonwebtoken";
import { UserRole } from "../models/user";

const JWT_ISSUER = "hackerearth-hub-nmamit";
const JWT_EXPIRES_IN = "7d";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}

const getJwtSecret = (): string => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is required for authentication.");
  }

  return jwtSecret;
};

const isJwtPayload = (payload: unknown): payload is JwtPayload => {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  const candidate = payload as Partial<JwtPayload>;

  return (
    typeof candidate.userId === "string" &&
    candidate.userId.trim().length > 0 &&
    (candidate.role === "student" || candidate.role === "admin")
  );
};

export const generateAuthToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    algorithm: "HS256",
    expiresIn: JWT_EXPIRES_IN,
    issuer: JWT_ISSUER,
  });
};

export const verifyAuthToken = (token: string): JwtPayload => {
  const decoded = jwt.verify(token, getJwtSecret(), {
    algorithms: ["HS256"],
    issuer: JWT_ISSUER,
  });

  if (!isJwtPayload(decoded)) {
    throw new Error("Invalid JWT payload.");
  }

  return {
    userId: decoded.userId,
    role: decoded.role,
  };
};
