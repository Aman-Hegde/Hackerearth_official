import { Request, Response } from "express";
import mongoose, { SortOrder } from "mongoose";
import User, { EnrolledDomain, IUser, VALID_DOMAINS } from "../models/user";
import SystemSettings, { getSystemSettings } from "../models/systemSettings";
import { isStudentRegistrationAvailable } from "../middleware/requireRegistrationOpen";

interface StudentStatusBody {
  isActive?: unknown;
}

interface RegistrationSettingsBody {
  studentRegistrationOpen?: unknown;
  registrationMessage?: unknown;
  registrationOpensAt?: unknown;
  registrationClosesAt?: unknown;
}

interface StudentListFilter {
  role: "student";
  $or?: Array<{ name: RegExp } | { email: RegExp } | { usn: RegExp }>;
  branch?: RegExp;
  year?: number;
  enrolledDomains?: EnrolledDomain;
  isActive?: boolean;
}

const MAX_REGISTRATION_MESSAGE_LENGTH = 500;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;

const isString = (value: unknown): value is string => typeof value === "string";

const normalizeString = (value: unknown): string => {
  return isString(value) ? value.trim() : "";
};

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const parsePositiveInteger = (
  value: unknown,
  defaultValue: number,
  maxValue?: number
): number => {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return defaultValue;
  }

  return maxValue ? Math.min(parsed, maxValue) : parsed;
};

const isValidDomain = (domain: string): domain is EnrolledDomain => {
  return (VALID_DOMAINS as readonly string[]).includes(domain);
};

const parseOptionalDate = (
  value: unknown
): { date?: Date | null; message?: string } => {
  if (value === undefined) {
    return {};
  }

  if (value === null || value === "") {
    return { date: null };
  }

  if (!isString(value)) {
    return { message: "Date values must be valid ISO date strings or null." };
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return { message: "Date values must be valid ISO date strings or null." };
  }

  return { date };
};

const toSafeStudent = (user: IUser) => ({
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
  createdAt: user.createdAt,
});

const toSafeSettings = (settings: Awaited<ReturnType<typeof getSystemSettings>>) => ({
  id: settings._id.toString(),
  key: settings.key,
  studentRegistrationOpen: settings.studentRegistrationOpen,
  registrationMessage: settings.registrationMessage,
  registrationOpensAt: settings.registrationOpensAt,
  registrationClosesAt: settings.registrationClosesAt,
  registrationOpen: isStudentRegistrationAvailable(settings),
  updatedBy: settings.updatedBy?.toString(),
  createdAt: settings.createdAt,
  updatedAt: settings.updatedAt,
});

export const getAdminOverview = async (_req: Request, res: Response) => {
  try {
    const [
      totalStudents,
      activeStudents,
      inactiveStudents,
      totalAdmins,
      verifiedStudents,
      settings,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "student", isActive: true }),
      User.countDocuments({ role: "student", isActive: false }),
      User.countDocuments({ role: "admin" }),
      User.countDocuments({ role: "student", emailVerified: true }),
      getSystemSettings(),
    ]);

    return res.status(200).json({
      success: true,
      overview: {
        totalStudents,
        activeStudents,
        inactiveStudents,
        totalAdmins,
        verifiedStudents,
        registrationOpen: isStudentRegistrationAvailable(settings),
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getStudents = async (req: Request, res: Response) => {
  try {
    const page = parsePositiveInteger(req.query.page, DEFAULT_PAGE);
    const limit = parsePositiveInteger(req.query.limit, DEFAULT_LIMIT, MAX_LIMIT);
    const skip = (page - 1) * limit;
    const filter: StudentListFilter = { role: "student" };

    const search = normalizeString(req.query.search);
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filter.$or = [{ name: regex }, { email: regex }, { usn: regex }];
    }

    const branch = normalizeString(req.query.branch);
    if (branch) {
      filter.branch = new RegExp(`^${escapeRegex(branch)}$`, "i");
    }

    const year = Number(req.query.year);
    if (req.query.year !== undefined) {
      if (!Number.isInteger(year) || year < 1 || year > 4) {
        return res.status(400).json({
          success: false,
          code: "INVALID_QUERY",
          message: "Year must be an integer from 1 to 4.",
        });
      }
      filter.year = year;
    }

    const domain = normalizeString(req.query.domain);
    if (domain) {
      if (!isValidDomain(domain)) {
        return res.status(400).json({
          success: false,
          code: "INVALID_QUERY",
          message: "Domain filter contains an invalid value.",
        });
      }
      filter.enrolledDomains = domain;
    }

    const status = normalizeString(req.query.status);
    if (status) {
      if (status !== "active" && status !== "inactive") {
        return res.status(400).json({
          success: false,
          code: "INVALID_QUERY",
          message: "Status must be active or inactive.",
        });
      }
      filter.isActive = status === "active";
    }

    const sortBy = normalizeString(req.query.sortBy) || "createdAt";
    if (!["createdAt", "name", "usn"].includes(sortBy)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_QUERY",
        message: "sortBy must be createdAt, name, or usn.",
      });
    }

    const sortOrderValue = normalizeString(req.query.sortOrder) || "desc";
    if (sortOrderValue !== "asc" && sortOrderValue !== "desc") {
      return res.status(400).json({
        success: false,
        code: "INVALID_QUERY",
        message: "sortOrder must be asc or desc.",
      });
    }

    const sort: Record<string, SortOrder> = {
      [sortBy]: sortOrderValue === "asc" ? 1 : -1,
    };

    const [students, total] = await Promise.all([
      User.find(filter)
        .select(
          "name email usn contactNumber branch year enrolledDomains role emailVerified isActive createdAt"
        )
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .exec(),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      students: students.map(toSafeStudent),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const updateStudentStatus = async (
  req: Request<{ studentId: string }, unknown, StudentStatusBody>,
  res: Response
) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_STUDENT_ID",
        message: "A valid student id is required.",
      });
    }

    if (typeof req.body.isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        code: "INVALID_STATUS",
        message: "isActive must be a boolean value.",
      });
    }

    const student = await User.findOneAndUpdate(
      { _id: req.params.studentId, role: "student" },
      { $set: { isActive: req.body.isActive } },
      {
        new: true,
        runValidators: true,
      }
    ).select(
      "name email usn contactNumber branch year enrolledDomains role emailVerified isActive createdAt"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        code: "STUDENT_NOT_FOUND",
        message: "Student not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Student status updated successfully.",
      student: toSafeStudent(student),
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getRegistrationSettings = async (_req: Request, res: Response) => {
  try {
    const settings = await getSystemSettings();

    return res.status(200).json({
      success: true,
      settings: toSafeSettings(settings),
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const updateRegistrationSettings = async (
  req: Request<unknown, unknown, RegistrationSettingsBody>,
  res: Response
) => {
  try {
    const updates: Record<string, unknown> = {};

    if (req.body.studentRegistrationOpen !== undefined) {
      if (typeof req.body.studentRegistrationOpen !== "boolean") {
        return res.status(400).json({
          success: false,
          code: "INVALID_SETTINGS",
          message: "studentRegistrationOpen must be a boolean value.",
        });
      }
      updates.studentRegistrationOpen = req.body.studentRegistrationOpen;
    }

    if (req.body.registrationMessage !== undefined) {
      const registrationMessage = normalizeString(req.body.registrationMessage);
      if (!registrationMessage) {
        return res.status(400).json({
          success: false,
          code: "INVALID_SETTINGS",
          message: "registrationMessage cannot be empty.",
        });
      }

      if (registrationMessage.length > MAX_REGISTRATION_MESSAGE_LENGTH) {
        return res.status(400).json({
          success: false,
          code: "INVALID_SETTINGS",
          message: `registrationMessage cannot exceed ${MAX_REGISTRATION_MESSAGE_LENGTH} characters.`,
        });
      }

      updates.registrationMessage = registrationMessage;
    }

    const opensAtResult = parseOptionalDate(req.body.registrationOpensAt);
    const closesAtResult = parseOptionalDate(req.body.registrationClosesAt);

    if (opensAtResult.message || closesAtResult.message) {
      return res.status(400).json({
        success: false,
        code: "INVALID_SETTINGS",
        message: opensAtResult.message ?? closesAtResult.message,
      });
    }

    if ("date" in opensAtResult) {
      updates.registrationOpensAt = opensAtResult.date;
    }

    if ("date" in closesAtResult) {
      updates.registrationClosesAt = closesAtResult.date;
    }

    const currentSettings = await getSystemSettings();
    const nextOpensAt =
      "registrationOpensAt" in updates
        ? (updates.registrationOpensAt as Date | null | undefined)
        : currentSettings.registrationOpensAt;
    const nextClosesAt =
      "registrationClosesAt" in updates
        ? (updates.registrationClosesAt as Date | null | undefined)
        : currentSettings.registrationClosesAt;

    if (nextOpensAt && nextClosesAt && nextClosesAt <= nextOpensAt) {
      return res.status(400).json({
        success: false,
        code: "INVALID_SETTINGS",
        message: "registrationClosesAt must be later than registrationOpensAt.",
      });
    }

    updates.updatedBy = new mongoose.Types.ObjectId(req.auth?.userId);

    const updatedSettings = await SystemSettings.findOneAndUpdate(
      { key: currentSettings.key },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    ).exec();

    if (!updatedSettings) {
      return res.status(500).json({
        success: false,
        message: "Unable to update registration settings.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Registration settings updated successfully.",
      settings: toSafeSettings(updatedSettings),
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};
