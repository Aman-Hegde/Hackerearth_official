import { Request, Response } from "express";
import User, { EnrolledDomain } from "../models/user";

interface DomainGroup {
  domain: EnrolledDomain;
  joinUrl: string;
}

const DOMAIN_GROUP_ENV_KEYS: Record<EnrolledDomain, string> = {
  "Web Development": "WHATSAPP_WEB_DEVELOPMENT_URL",
  DSA: "WHATSAPP_DSA_URL",
  Aptitude: "WHATSAPP_APTITUDE_URL",
};

const getConfiguredDomainGroups = (
  enrolledDomains: EnrolledDomain[]
): DomainGroup[] => {
  return enrolledDomains.flatMap((domain) => {
    const joinUrl = process.env[DOMAIN_GROUP_ENV_KEYS[domain]]?.trim();

    if (!joinUrl) {
      return [];
    }

    return [{ domain, joinUrl }];
  });
};

export const getStudentDomainGroups = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Authentication is required.",
      });
    }

    const student = await User.findById(req.auth.userId)
      .select("enrolledDomains isActive role")
      .exec();

    if (!student) {
      return res.status(401).json({
        success: false,
        code: "INVALID_TOKEN",
        message: "Invalid authentication token.",
      });
    }

    if (student.role !== "student") {
      return res.status(403).json({
        success: false,
        code: "FORBIDDEN",
        message: "You do not have permission to access this resource.",
      });
    }

    if (!student.isActive) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_INACTIVE",
        message: "This account is currently inactive.",
      });
    }

    return res.status(200).json({
      success: true,
      groups: getConfiguredDomainGroups(student.enrolledDomains),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};
