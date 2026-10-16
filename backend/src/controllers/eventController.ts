import { Request, Response } from "express";
import ExcelJS from "exceljs";
import mongoose, { Types } from "mongoose";
import Event, { IEvent } from "../models/Event";
import EventRegistration from "../models/EventRegistration";
import User from "../models/user";
import GuestEventRegistration, { GuestParticipant } from "../models/GuestEventRegistration";
import { uploadEventPosterToCloudinary } from "../config/cloudinary";

type EventStatus = "open" | "full" | "closed" | "ongoing" | "past";

interface EventBody {
  tagline?: unknown;
  imageUrls?: unknown;
  rounds?: unknown;
  published?: unknown;
  title?: unknown;
  description?: unknown;
  venue?: unknown;
  posterUrl?: unknown;
  posterPublicId?: unknown;
  eventDateTime?: unknown;
  eventEndDateTime?: unknown;
  registrationDeadline?: unknown;
  maxRegistrations?: unknown;
  active?: unknown;
}

const MAX_EVENT_TITLE_LENGTH = 120;
const MAX_EVENT_DESCRIPTION_LENGTH = 2000;
const MAX_EVENT_VENUE_LENGTH = 160;
const MAX_POSTER_URL_LENGTH = 1000;
const MAX_EVENT_REGISTRATIONS = 10000;
const EVENT_REGISTRATION_STUDENT_FIELDS =
  "name usn email contactNumber year";

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
  eventEndDateTime?: Date | null;
  registrationDeadline: Date;
  registrationCount: number;
  maxRegistrations: number;
  active: boolean;
}): EventStatus => {
  const now = new Date();
  const eventEndDateTime =
    event.eventEndDateTime instanceof Date && !Number.isNaN(event.eventEndDateTime.getTime())
      ? event.eventEndDateTime
      : null;

  if (eventEndDateTime) {
    if (now >= eventEndDateTime) return "past";
    if (now >= event.eventDateTime) return "ongoing";
  } else if (now >= event.eventDateTime) {
    return "past";
  }

  if (event.registrationCount >= event.maxRegistrations) return "full";
  if (!event.active || now >= event.registrationDeadline) return "closed";
  return "open";
};

const getRegistrationOpen = (event: {
  eventDateTime: Date;
  eventEndDateTime?: Date | null;
  registrationDeadline: Date;
  registrationCount: number;
  maxRegistrations: number;
  active: boolean;
}) => getEventStatus(event) === "open";

const toSafeEvent = (event: IEvent, isRegistered = false) => ({
  id: event._id.toString(),
  tagline: event.tagline ?? "",
  imageUrls: event.imageUrls ?? [],
  rounds: event.rounds ?? [],
  published: event.published ?? true,
  title: event.title,
  description: event.description,
  venue: event.venue,
  posterUrl: event.posterUrl,
  posterPublicId: event.posterPublicId ?? null,
  eventDateTime: event.eventDateTime,
  eventEndDateTime: event.eventEndDateTime ?? null,
  registrationDeadline: event.registrationDeadline,
  maxRegistrations: event.maxRegistrations,
  registrationCount: event.registrationCount,
  active: event.active,
  status: getEventStatus(event),
  registrationOpen: event.published !== false && getRegistrationOpen(event),
  isRegistered,
  createdAt: event.createdAt,
  updatedAt: event.updatedAt,
});

const toEventRegistrationStudent = (registration: {
  _id: unknown;
  createdAt: Date;
  studentId?: {
    name?: string;
    usn?: string;
    email?: string;
    contactNumber?: string;
    year?: number;
  };
}) => ({
  id: String(registration._id),
  name: registration.studentId?.name ?? "Unknown student",
  usn: registration.studentId?.usn ?? "",
  email: registration.studentId?.email ?? "",
  contactNumber: registration.studentId?.contactNumber ?? "",
  year: registration.studentId?.year ?? null,
  registeredAt: registration.createdAt,
});

const getGuestAttendees = async (eventId: string) => {
  const guests = await GuestEventRegistration.find({ eventId }).sort({ createdAt: 1 }).exec();
  return guests.map((guest) => ({ id: String(guest._id), name: guest.name,
    email: guest.email, contactNumber: guest.contactNumber, usn: "", year: null,
    registeredAt: guest.createdAt }));
};

const sanitizeFilenamePart = (value: string) => {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "event";
};

const validateEventPayload = (
  body: EventBody,
  options: { partial: boolean; currentRegistrationCount?: number }
) => {
  const update: Partial<{
    tagline: string;
    imageUrls: string[];
    rounds: string[];
    published: boolean;
    title: string;
    description: string;
    venue: string;
    posterUrl: string;
    posterPublicId: string;
    eventDateTime: Date;
    eventEndDateTime: Date;
    registrationDeadline: Date;
    maxRegistrations: number;
    active: boolean;
  }> = {};

  if (body.tagline !== undefined) {
    if (typeof body.tagline !== "string" || body.tagline.length > 160) return { error: "Tagline must be at most 160 characters." };
    update.tagline = body.tagline.trim();
  }
  for (const field of ["imageUrls", "rounds"] as const) {
    const value = body[field];
    if (value === undefined) continue;
    if (!Array.isArray(value) || value.length > 20 || value.some((item) =>
      typeof item !== "string" || !item.trim() || (field === "imageUrls" ? !isEventImageUrl(item) : item.length > 100))) {
      return { error: `Invalid ${field}. Supply at most 20 valid entries.` };
    }
    update[field] = [...new Set(value.map((item: string) => item.trim()))];
  }
  if (body.published !== undefined) {
    if (typeof body.published !== "boolean") return { error: "Published must be true or false." };
    update.published = body.published;
  }
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
    if (!isEventImageUrl(posterUrl)) return { error: "Poster must be an http(s) URL or a local /events/ image path." };
    update.posterUrl = posterUrl;
  }

  if (body.posterPublicId !== undefined) {
    const posterPublicId = normalizeString(body.posterPublicId);
    if (posterPublicId.length > 300) {
      return { error: "Poster metadata is invalid." };
    }
    if (posterPublicId) {
      update.posterPublicId = posterPublicId;
    }
  }

  if (body.eventDateTime !== undefined || required) {
    const eventDateTime = parseDate(body.eventDateTime);
    if (!eventDateTime) return { error: "A valid event date and time is required." };
    if (!options.partial && eventDateTime <= new Date()) {
      return { error: "Event date and time must be in the future." };
    }
    update.eventDateTime = eventDateTime;
  }

  if (body.eventEndDateTime !== undefined || required) {
    const eventEndDateTime = parseDate(body.eventEndDateTime);
    if (!eventEndDateTime) {
      return { error: "A valid event end date and time is required." };
    }
    update.eventEndDateTime = eventEndDateTime;
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

    const { eventDateTime, eventEndDateTime, registrationDeadline } = validation.update;
    if (!eventDateTime || !eventEndDateTime || eventEndDateTime <= eventDateTime) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_DATES",
        message: "Event end date and time must be after the event start date and time.",
      });
    }

    if (!registrationDeadline || registrationDeadline > eventDateTime) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_DATES",
        message: "Registration deadline must be before or at the event start date and time.",
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

export const uploadAdminEventPoster = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        code: "POSTER_REQUIRED",
        message: "Choose a poster image to upload.",
      });
    }

    const result = await uploadEventPosterToCloudinary(req.file.buffer);

    return res.status(200).json({
      success: true,
      poster: {
        url: result.secure_url,
        publicId: result.public_id,
      },
    });
  } catch (_error) {
    return res.status(502).json({
      success: false,
      code: "POSTER_UPLOAD_FAILED",
      message: "Poster upload failed. Please try again.",
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
    const nextEventEndDateTime =
      validation.update.eventEndDateTime ?? event.eventEndDateTime;
    const nextRegistrationDeadline =
      validation.update.registrationDeadline ?? event.registrationDeadline;

    if (nextEventEndDateTime && nextEventEndDateTime <= nextEventDateTime) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_DATES",
        message: "Event end date and time must be after the event start date and time.",
      });
    }

    if (nextRegistrationDeadline > nextEventDateTime) {
      return res.status(400).json({
        success: false,
        code: "INVALID_EVENT_DATES",
        message: "Registration deadline must be before or at the event start date and time.",
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

export const getAdminEventRegistrations = async (
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

    const registrations = await EventRegistration.find({ eventId })
      .sort({ createdAt: 1 })
      .populate<{
        studentId?: {
          name?: string;
          usn?: string;
          email?: string;
          contactNumber?: string;
          year?: number;
        };
      }>("studentId", EVENT_REGISTRATION_STUDENT_FIELDS)
      .exec();

    return res.status(200).json({
      success: true,
      event: {
        id: event._id.toString(),
        title: event.title,
        registrationCount: event.registrationCount,
        maxRegistrations: event.maxRegistrations,
      },
      registrations: [...registrations.map(toEventRegistrationStudent),
        ...await getGuestAttendees(eventId)],
    });
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const exportAdminEventRegistrations = async (
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

    const registrations = await EventRegistration.find({ eventId })
      .sort({ createdAt: 1 })
      .populate<{
        studentId?: {
          name?: string;
          usn?: string;
          email?: string;
          contactNumber?: string;
          year?: number;
        };
      }>("studentId", EVENT_REGISTRATION_STUDENT_FIELDS)
      .exec();

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HackerEarth Hub NMAMIT";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Registrations");
    worksheet.columns = [
      { header: "Name", key: "name", width: 28 },
      { header: "USN", key: "usn", width: 16 },
      { header: "Email", key: "email", width: 32 },
      { header: "Phone Number", key: "contactNumber", width: 18 },
      { header: "Year", key: "year", width: 10 },
    ];
    worksheet.getRow(1).font = { bold: true };
    worksheet.views = [{ state: "frozen", ySplit: 1 }];
    worksheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: 5 },
    };

    registrations.forEach((registration) => {
      const student = toEventRegistrationStudent(registration);
      worksheet.addRow({
        name: student.name,
        usn: student.usn,
        email: student.email,
        contactNumber: student.contactNumber,
        year: student.year ?? "",
      });
    });

    for (const guest of await getGuestAttendees(eventId)) {
      worksheet.addRow(guest);
    }

    const filename = `${sanitizeFilenamePart(event.title)}-registrations.xlsx`;

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (_error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error.",
    });
  }
};

export const getStudentEvents = async (req: Request, res: Response) => {
  try {
    const [events, registrations] = await Promise.all([
      Event.find({ published: { $ne: false } }).sort({ eventDateTime: 1 }).exec(),
      req.auth ? EventRegistration.find({ studentId: req.auth.userId })
        .select("eventId")
        .exec() : Promise.resolve([]),
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
  const body: unknown = req.body ?? {};
  const allowedFields = req.auth ? [] : ["name", "email", "contactNumber"];
  if (!body || typeof body !== "object" || Array.isArray(body) ||
      Object.keys(body).some((key) => !allowedFields.includes(key))) {
    return res.status(400).json({ success: false, code: "INVALID_REGISTRATION",
      message: "Only participant registration fields are allowed." });
  }
  let guest: GuestParticipant | undefined;
  if (!req.auth) {
    const input = body as Record<string, unknown>;
    guest = { name: normalizeString(input.name), email: normalizeString(input.email).toLowerCase(),
      contactNumber: normalizeString(input.contactNumber) };
    if (guest.name.length < 2 || guest.name.length > 100 || guest.email.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guest.email) || !/^\d{10}$/.test(guest.contactNumber)) {
      return res.status(400).json({ success: false, code: "INVALID_PARTICIPANT",
        message: "Enter your name, valid email, and 10-digit phone number." });
    }
  }

  const { eventId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      success: false,
      code: "INVALID_EVENT_ID",
      message: "A valid event id is required.",
    });
  }

  let session: mongoose.ClientSession | undefined;

  try {
    const student = req.auth ? await User.findOne({
      _id: req.auth.userId,
      role: { $in: ["student", "admin"] },
      emailVerified: true,
      isActive: true,
    })
      .select("_id")
      .exec() : null;

    if (req.auth && !student) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_INACTIVE",
        message: "This account is not active or verified.",
      });
    }

    const now = new Date();
    let registeredEventSummary: {
      registrationCount: number;
      maxRegistrations: number;
    } | null = null;

    session = await mongoose.startSession();
    await session.withTransaction(async (transactionSession) => {
      const updatedEvent = await Event.findOneAndUpdate(
        {
          _id: eventId,
          active: true,
          published: { $ne: false },
          eventDateTime: { $gt: now },
          registrationDeadline: { $gt: now },
          $expr: { $lt: ["$registrationCount", "$maxRegistrations"] },
        },
        { $inc: { registrationCount: 1 } },
        { new: true, session: transactionSession }
      ).exec();

      if (!updatedEvent) {
        throw new Error("EVENT_NOT_REGISTERABLE");
      }

      registeredEventSummary = {
        registrationCount: updatedEvent.registrationCount,
        maxRegistrations: updatedEvent.maxRegistrations,
      };

      if (guest) {
        await GuestEventRegistration.create([{ eventId: new Types.ObjectId(eventId), ...guest }], { session: transactionSession });
      } else if (student) {
        await EventRegistration.create(
          [{ eventId: new Types.ObjectId(eventId), studentId: student._id }],
          { session: transactionSession }
        );
      }
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
          : status === "past" || status === "ongoing"
            ? "This event has already started."
            : "Registration is closed for this event.";

      return res.status(409).json({
        success: false,
        code:
          status === "full"
            ? "EVENT_FULL"
            : status === "past" || status === "ongoing"
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
    await session?.endSession();
  }
};

const isEventImageUrl = (value: string) => {
  if (value.length > 1000) return false;
  if (/^\/events\/[a-zA-Z0-9_/-]+\.(webp|png|jpe?g)$/i.test(value)) return true;
  try { return ["http:", "https:"].includes(new URL(value).protocol); } catch { return false; }
};

// Explicit admin import; never runs at startup or from the public events API.
export const importProjectDoomsday = async (req: Request, res: Response) => {
  const id = new Types.ObjectId("70c800000000000000000010");
  try {
    const existing = await Event.findOne({ $or: [
      { _id: id }, { title: /project\s+doomsday/i }
    ] }).exec();
    if (existing) return res.status(200).json({ success: true, message: "Project Doomsday already exists. Use Edit to manage its photographs; no record was overwritten.", event: toSafeEvent(existing) });
    const event = await Event.create({
      _id: id, createdBy: new Types.ObjectId(req.auth!.userId),
      title: "PROJECT DOOMSDAY: SAVE THE TIMELINE",
      tagline: "Three rounds. One mission.",
      description: "Project Doomsday brought together participants for a three-round technical challenge testing knowledge, logical thinking, pattern printing, and data structure and algorithm skills.",
      rounds: ["MCQ Challenge", "Pattern Printing", "DSA Challenge"],
      imageUrls: Array.from(
  { length: 7 },
  (_, i) =>
    `/events/project-doomsday/doomsday-${String(i + 2).padStart(2, "0")}.webp`
),
      posterUrl: "/events/project-doomsday/doomsday-02.webp",
      venue: "Not specified", eventDateTime: new Date("2026-10-10T09:00:00+05:30"),
      registrationDeadline: new Date("2026-10-10T09:00:00+05:30"),
      maxRegistrations: 1, active: false, published: true,
    });
    return res.status(201).json({ success: true, message: "Project Doomsday published in Past Events.", event: toSafeEvent(event) });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000)
      return res.status(409).json({ success: false, message: "Project Doomsday was already imported. Refresh the event list." });
    return res.status(500).json({ success: false, message: "Unable to import Project Doomsday." });
  }
};
