import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Event, { IEvent } from "../models/Event";
import EventRegistration from "../models/EventRegistration";
import User from "../models/user";

type EventStatus = "open" | "full" | "closed" | "past";

interface EventBody {
  title?: unknown;
  description?: unknown;
  venue?: unknown;
  posterUrl?: unknown;
  eventDateTime?: unknown;
  registrationDeadline?: unknown;
  maxRegistrations?: unknown;
  active?: unknown;
}

const MAX_EVENT_TITLE_LENGTH = 120;
const MAX_EVENT_DESCRIPTION_LENGTH = 2000;
const MAX_EVENT_VENUE_LENGTH = 160;
const MAX_POSTER_URL_LENGTH = 1000;
const MAX_EVENT_REGISTRATIONS = 10000;

const normalizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const parseDate = (value: unknown): Date | null => {
  if (typeof value !== "string" && !(value instanceof Date)) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const parsePositiveInteger = (
  value: unknown,
  max = MAX_EVENT_REGISTRATIONS
): number | null => {
  const parsed = typeof value === "string" ? Number(value) : value;
  return typeof parsed === "number" &&
    Number.isInteger(parsed) &&
    parsed > 0 &&
    parsed <= max
    ? parsed
    : null;
};

const getEventStatus = (event: {
  eventDateTime: Date;
  registrationDeadline: Date;
  registrationCount: number;
  maxRegistrations: number;
  active: boolean;
}): EventStatus => {
  const now = new Date();

  if (now >= event.eventDateTime) return "past";
  if (event.registrationCount >= event.maxRegistrations) return "full";
  if (!event.active || now >= event.registrationDeadline) return "closed";
  return "open";
};

const getRegistrationOpen = (event: {
  eventDateTime: Date;
  registrationDeadline: Date;
  registrationCount: number;
  maxRegistrations: number;
  active: boolean;
}) => getEventStatus(event) === "open";

const toSafeEvent = (event: IEvent, isRegistered = false) => ({
  id: event._id.toString(),
  title: event.title,
  description: event.description,
  venue: event.venue,
  posterUrl: event.posterUrl,
  eventDateTime: event.eventDateTime,
  registrationDeadline: event.registrationDeadline,
  maxRegistrations: event.maxRegistrations,
  registrationCount: event.registrationCount,
  active: event.active,
  status: getEventStatus(event),
  registrationOpen: getRegistrationOpen(event),
  isRegistered,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
});

const validateEventPayload = (
  body: EventBody,
  options: { partial: boolean; currentRegistrationCount?: number }
) => {
  const update: Partial<{
    title: string;
    description: string;
    venue: string;
    posterUrl: string;
    eventDateTime: Date;
    registrationDeadline: Date;
    maxRegistrations: number;
    active: boolean;
  }> = {};

  const required = !options.partial;

  const title = normalizeString(body.title);
  if (title || required) {
    if (!title || title.length > MAX_EVENT_TITLE_LENGTH) {
      return { error: "Event title is required and must be concise." };
    }
    update.title = title;
  }

  const description = normalizeString(body.description);
  if (description || required) {
    if (!description || description.length > MAX_EVENT_DESCRIPTION_LENGTH) {
      return { error: "Event description is required." };
    }
    update.description = description;
  }

  const venue = normalizeString(body.venue);
  if (venue || required) {
    if (!venue || venue.length > MAX_EVENT_VENUE_LENGTH) {
      return { error: "Event venue is required." };
    }
    update.venue = venue;
  }

  const posterUrl = normalizeString(body.posterUrl);
  if (posterUrl || required) {
    if (!posterUrl || posterUrl.length > MAX_POSTER_URL_LENGTH) {
      return { error: "Poster image URL is required." };
    }
    try {
      const parsed = new URL(posterUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return { error: "Poster image URL must be a valid http or https URL." };
      }
    } catch {
      return { error: "Poster image URL must be valid." };
    }
    update.posterUrl = posterUrl;
  }

  if (body.eventDateTime !== undefined || required) {
    const eventDateTime = parseDate(body.eventDateTime);
    if (!eventDateTime) return { error: "A valid event date and time is required." };
    if (!options.partial && eventDateTime <= new Date()) {
      return { error: "Event date and time must be in the future." };
    }
    update.eventDateTime = eventDateTime;
  }

  if (body.registrationDeadline !== undefined || required) {
    const registrationDeadline = parseDate(body.registrationDeadline);
    if (!registrationDeadline) {
      return { error: "A valid registration deadline is required." };
    }
    update.registrationDeadline = registrationDeadline;
  }

  if (body.maxRegistrations !== undefined || required) {
    const maxRegistrations = parsePositiveInteger(body.maxRegistrations);
    if (!maxRegistrations) {
      return {
        error: `Maximum registrations must be a whole number from 1 to ${MAX_EVENT_REGISTRATIONS}.`,
      };
    }
    if (
      options.currentRegistrationCount !== undefined &&
      maxRegistrations < options.currentRegistrationCount
    ) {
      return {
        error: "Maximum registrations cannot be below the current registration count.",
      };
    }
    update.maxRegistrations = maxRegistrations;
  }

  if (body.active !== undefined) {
    if (typeof body.active !== "boolean") {
      return { error: "Active must be true or false." };
    }
    update.active = body.active;
  }

  return { update };
};

export const createAdminEvent = async (
  req: Request<unknown, unknown, EventBody>,
  res: Response
) => {
  try {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Authentication is required.",
      });
    }

    const validation = validateEventPayload(req.body, { partial: false });
    if (validation.error || !validation.update) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT",
        message: validation.error,
      });
    }

    const { eventDateTime, registrationDeadline } = validation.update;
    if (!eventDateTime || !registrationDeadline || registrationDeadline >= eventDateTime) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_DATES",
        message: "Registration deadline must be before the event date and time.",
      });
    }

    const event = await Event.create({
      ...validation.update,
      createdBy: new Types.ObjectId(req.auth.userId),
      active: validation.update.active ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Event created successfully.",
      event: toSafeEvent(event),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getAdminEvents = async (_req: Request, res: Response) => {
  try {
    const events = await Event.find().sort({ eventDateTime: -1 }).exec();

    return res.status(200).json({
      success: true,
      events: events.map((event) => toSafeEvent(event)),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getAdminEvent = async (
  req: Request<{ eventId: string }>,
  res: Response
) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_ID",
        message: "A valid event id is required.",
      });
    }

    const event = await Event.findById(eventId).exec();
    if (!event) {
      return res.status(404).json({
        success: false,
        code: "EVENT_NOT_FOUND",
        message: "Event not found.",
      });
    }

    return res.status(200).json({
      success: true,
      event: toSafeEvent(event),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const updateAdminEvent = async (
  req: Request<{ eventId: string }, unknown, EventBody>,
  res: Response
) => {
  try {
    const { eventId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_ID",
        message: "A valid event id is required.",
      });
    }

    const event = await Event.findById(eventId).exec();
    if (!event) {
      return res.status(404).json({
        success: false,
        code: "EVENT_NOT_FOUND",
        message: "Event not found.",
      });
    }

    if (new Date() >= event.eventDateTime) {
      return res.status(409).json({
        success: false,
        code: "EVENT_PAST",
        message: "Past events cannot be edited.",
      });
    }

    const validation = validateEventPayload(req.body, {
      partial: true,
      currentRegistrationCount: event.registrationCount,
    });
    if (validation.error || !validation.update) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT",
        message: validation.error,
      });
    }

    const nextEventDateTime = validation.update.eventDateTime ?? event.eventDateTime;
    const nextRegistrationDeadline =
      validation.update.registrationDeadline ?? event.registrationDeadline;

    if (nextEventDateTime <= new Date()) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_DATES",
        message: "Event date and time must be in the future.",
      });
    }

    if (nextRegistrationDeadline >= nextEventDateTime) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_DATES",
        message: "Registration deadline must be before the event date and time.",
      });
    }

    Object.assign(event, validation.update);
    await event.save();

    return res.status(200).json({
      success: true,
      message: "Event updated successfully.",
      event: toSafeEvent(event),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getStudentEvents = async (req: Request, res: Response) => {
  try {
    if (!req.auth) {
      return res.status(401).json({
        success: false,
        code: "AUTH_REQUIRED",
        message: "Authentication is required.",
      });
    }

    const [events, registrations] = await Promise.all([
      Event.find().sort({ eventDateTime: 1 }).exec(),
      EventRegistration.find({ studentId: req.auth.userId })
        .select("eventId")
        .exec(),
    ]);
    const registeredEventIds = new Set(
      registrations.map((registration) => registration.eventId.toString())
    );
    const safeEvents = events.map((event) =>
      toSafeEvent(event, registeredEventIds.has(event._id.toString()))
    );

    return res.status(200).json({
      success: true,
      upcoming: safeEvents.filter((event) => event.status !== "past"),
      past: safeEvents.filter((event) => event.status === "past"),
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const registerForEvent = async (
  req: Request<{ eventId: string }>,
  res: Response
) => {
  if (!req.auth) {
    return res.status(401).json({
      success: false,
      code: "AUTH_REQUIRED",
      message: "Authentication is required.",
    });
  }

  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      success: false,
      code: "INVALID_EVENT_ID",
      message: "A valid event id is required.",
    });
  }

  const session = await mongoose.startSession();

  try {
    const student = await User.findOne({
      _id: req.auth.userId,
      role: "student",
      isActive: true,
    })
      .select("_id")
      .exec();

    if (!student) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_INACTIVE",
        message: "This student account is not active.",
      });
    }

    const now = new Date();
    let registeredEventSummary: {
      registrationCount: number;
      maxRegistrations: number;
    } | null = null;

    await session.withTransaction(async () => {
      const updatedEvent = await Event.findOneAndUpdate(
        {
          _id: eventId,
          active: true,
          eventDateTime: { $gt: now },
          registrationDeadline: { $gt: now },
          $expr: { $lt: ["$registrationCount", "$maxRegistrations"] },
        },
        { $inc: { registrationCount: 1 } },
        { new: true, session }
      ).exec();

      if (!updatedEvent) {
        throw new Error("EVENT_NOT_REGISTERABLE");
      }

      registeredEventSummary = {
        registrationCount: updatedEvent.registrationCount,
        maxRegistrations: updatedEvent.maxRegistrations,
      };

      await EventRegistration.create(
        [
          {
            eventId: new Types.ObjectId(eventId),
            studentId: student._id,
          },
        ],
        { session }
      );
    });

    const summary = registeredEventSummary as {
      registrationCount: number;
      maxRegistrations: number;
    } | null;

    if (!summary) {
      throw new Error("EVENT_NOT_REGISTERABLE");
    }

    return res.status(201).json({
      success: true,
      message: "You are registered for this event.",
      registrationCount: summary.registrationCount,
      maxRegistrations: summary.maxRegistrations,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "EVENT_NOT_REGISTERABLE") {
      const event = await Event.findById(eventId).exec();

      if (!event) {
        return res.status(404).json({
          success: false,
          code: "EVENT_NOT_FOUND",
          message: "Event not found.",
        });
      }

      const status = getEventStatus(event);
      const message =
        status === "full"
          ? "Registration is full for this event."
          : status === "past"
            ? "This event has already started."
            : "Registration is closed for this event.";

      return res.status(409).json({
        success: false,
        code:
          status === "full"
            ? "EVENT_FULL"
            : status === "past"
              ? "EVENT_PAST"
              : "REGISTRATION_CLOSED",
        message,
      });
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        code: "ALREADY_REGISTERED",
        message: "You are already registered for this event.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  } finally {
    await session.endSession();
  }
};
