import { NextFunction, Request, Response } from "express";
import { getSystemSettings, ISystemSettings } from "../models/systemSettings";

const DEFAULT_OPEN_MESSAGE = "Student registration is currently open.";

export const isStudentRegistrationAvailable = (
  settings: ISystemSettings,
  now = new Date()
): boolean => {
  if (!settings.studentRegistrationOpen) {
    return false;
  }

  if (settings.registrationOpensAt && now < settings.registrationOpensAt) {
    return false;
  }

  if (settings.registrationClosesAt && now >= settings.registrationClosesAt) {
    return false;
  }

  return true;
};

const getRegistrationClosedMessage = (
  settings: ISystemSettings,
  now = new Date()
): string => {
  if (!settings.studentRegistrationOpen) {
    return settings.registrationMessage;
  }

  const isUsingDefaultMessage =
    settings.registrationMessage === DEFAULT_OPEN_MESSAGE;

  if (settings.registrationOpensAt && now < settings.registrationOpensAt) {
    return isUsingDefaultMessage
      ? "Student registration has not opened yet."
      : settings.registrationMessage;
  }

  if (settings.registrationClosesAt && now >= settings.registrationClosesAt) {
    return isUsingDefaultMessage
      ? "Student registration is currently closed."
      : settings.registrationMessage;
  }

  return settings.registrationMessage;
};

export const requireRegistrationOpen = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await getSystemSettings();

    if (!isStudentRegistrationAvailable(settings)) {
      return res.status(403).json({
        success: false,
        code: "REGISTRATION_CLOSED",
        message: getRegistrationClosedMessage(settings),
      });
    }

    return next();
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to check registration availability.",
    });
  }
};
