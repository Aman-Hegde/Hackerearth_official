import { createHash, randomBytes } from "crypto";
import { Request, Response } from "express";
import ExcelJS from "exceljs";
import mongoose, { ClientSession, Types } from "mongoose";
import Event, { IEvent } from "../models/Event";
import EventRegistration from "../models/EventRegistration";
import EventTeam from "../models/EventTeam";
import EventTeamMember from "../models/EventTeamMember";
import GuestEventRegistration, {
  GuestParticipant,
} from "../models/GuestEventRegistration";
import User from "../models/user";
import {
  getEventEligibility,
  getEventParticipationType,
  getEventStatus,
  getTeamStatus,
  isEventRegistrationOpen,
  isEventRegistrationWindowOpen,
  normalizeIndianContactNumber,
} from "../services/eventRules";

type TeamAction = "create" | "join";

interface TeamRequestBody {
  teamName?: unknown;
  invitationCode?: unknown;
  name?: unknown;
  email?: unknown;
  contactNumber?: unknown;
  branch?: unknown;
}

interface RegisteredParticipant {
  type: "member" | "guest";
  studentId?: Types.ObjectId;
  contactNumber?: string;
  branch: string;
  guest: GuestParticipant | null;
}

class TeamRegistrationError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string
  ) {
    super(message);
  }
}

const TEAM_MEMBER_FIELDS = "name email usn contactNumber branch year";

const normalizeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizeTeamName = (value: string) =>
  value.normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("en-IN");

const generateInvitationCode = () => randomBytes(24).toString("base64url");
const generateAccessToken = () => randomBytes(32).toString("base64url");
const hashAccessToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");

const isDuplicateKeyError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "code" in error &&
  error.code === 11000;

const getDuplicateKey = (error: unknown) => {
  if (!isDuplicateKeyError(error)) return "";
  const record = error as Record<string, unknown>;
  const pattern = record.keyPattern;
  if (!pattern || typeof pattern !== "object") return "";
  return Object.keys(pattern as Record<string, unknown>).join("_");
};

const parseGuest = (body: TeamRequestBody): GuestParticipant | null => {
  const guest = {
    name: normalizeString(body.name),
    email: normalizeString(body.email).toLowerCase(),
    contactNumber: normalizeIndianContactNumber(body.contactNumber) ?? "",
    branch: normalizeString(body.branch),
  };
  if (
    guest.name.length < 2 ||
    guest.name.length > 100 ||
    guest.email.length > 254 ||
    !/^[^\s@]+@nmamit\.in$/i.test(guest.email) ||
    !guest.contactNumber ||
    guest.branch.length < 2 ||
    guest.branch.length > 160
  ) {
    return null;
  }
  return guest;
};

const assertAllowedBody = (
  body: unknown,
  allowedFields: readonly string[]
): body is Record<string, unknown> =>
  body !== null &&
  body !== undefined &&
  typeof body === "object" &&
  !Array.isArray(body) &&
  Object.keys(body).every((key) => allowedFields.includes(key));

const getTeamConfiguration = (event: IEvent) => {
  if (
    getEventParticipationType(event) !== "team" ||
    !event.minTeamSize ||
    !event.maxTeamSize
  ) {
    throw new TeamRegistrationError(
      409,
      "TEAM_EVENT_REQUIRED",
      "This event is not configured for team registration."
    );
  }
  return { minTeamSize: event.minTeamSize, maxTeamSize: event.maxTeamSize };
};

const ensureEventCanRegister = (event: IEvent) => {
  if (event.published === false || !isEventRegistrationOpen(event)) {
    const status = getEventStatus(event);
    const code =
      status === "full"
        ? "EVENT_FULL"
        : status === "past" || status === "ongoing"
          ? "EVENT_PAST"
          : "REGISTRATION_CLOSED";
    const message =
      status === "full"
        ? "Registration is full for this event."
        : status === "past" || status === "ongoing"
          ? "This event has already started."
          : "Registration is closed for this event.";
    throw new TeamRegistrationError(409, code, message);
  }
};

const loadAuthenticatedParticipant = async (req: Request) => {
  if (!req.auth) return null;
  const student = await User.findOne({
    _id: req.auth.userId,
    role: { $in: ["student", "admin"] },
    isActive: true,
    $or: [
      { role: "student" },
      { role: "admin", emailVerified: true },
    ],
  })
    .select("_id email contactNumber branch")
    .exec();
  if (!student) {
    throw new TeamRegistrationError(
      403,
      "ACCOUNT_INACTIVE",
      "This account is not active or verified."
    );
  }
  return student;
};

const reserveEventCapacity = async (
  eventId: Types.ObjectId,
  now: Date,
  session: ClientSession
) => {
  const event = await Event.findOneAndUpdate(
    {
      _id: eventId,
      participationType: "team",
      active: true,
      published: { $ne: false },
      eventDateTime: { $gt: now },
      registrationDeadline: { $gt: now },
      $expr: { $lt: ["$registrationCount", "$maxRegistrations"] },
    },
    { $inc: { registrationCount: 1 } },
    { returnDocument: "after", session }
  ).exec();
  if (!event) {
    throw new TeamRegistrationError(
      409,
      "EVENT_NOT_REGISTERABLE",
      "Registration is no longer available for this event."
    );
  }
  return event;
};

const createParticipantRegistration = async (
  eventId: Types.ObjectId,
  participant: RegisteredParticipant,
  session: ClientSession
) => {
  if (participant.type === "member" && participant.studentId) {
    const [registration] = await EventRegistration.create(
      [
        {
          eventId,
          studentId: participant.studentId,
          ...(participant.contactNumber
            ? { contactNumber: participant.contactNumber }
            : {}),
          branch: participant.branch,
        },
      ],
      { session }
    );
    if (!registration) throw new Error("MEMBER_REGISTRATION_NOT_CREATED");
    return {
      studentId: participant.studentId,
      eventRegistrationId: registration._id,
    };
  }
  if (participant.type === "guest" && participant.guest) {
    const [registration] = await GuestEventRegistration.create(
      [{ eventId, ...participant.guest }],
      { session }
    );
    if (!registration) throw new Error("GUEST_REGISTRATION_NOT_CREATED");
    return { guestRegistrationId: registration._id };
  }
  throw new Error("INVALID_TEAM_PARTICIPANT");
};

const createTeamRegistration = async ({
  event,
  participant,
  teamName,
}: {
  event: IEvent;
  participant: RegisteredParticipant;
  teamName: string;
}) => {
  const { minTeamSize, maxTeamSize } = getTeamConfiguration(event);
  const invitationCode = generateInvitationCode();
  const accessToken = participant.type === "guest" ? generateAccessToken() : null;
  let session: ClientSession | undefined;
  try {
    session = await mongoose.startSession();
    const result = await session.withTransaction(async (transactionSession) => {
      await reserveEventCapacity(event._id, new Date(), transactionSession);
      const [team] = await EventTeam.create(
        [
          {
            eventId: event._id,
            name: teamName,
            normalizedName: normalizeTeamName(teamName),
            invitationCode,
            currentMemberCount: 1,
          },
        ],
        { session: transactionSession }
      );
      if (!team) throw new Error("TEAM_NOT_CREATED");
      const registration = await createParticipantRegistration(
        event._id,
        participant,
        transactionSession
      );
      await EventTeamMember.create(
        [
          {
            eventId: event._id,
            teamId: team._id,
            participantType: participant.type,
            ...registration,
            isLeader: true,
            ...(accessToken ? { accessTokenHash: hashAccessToken(accessToken) } : {}),
          },
        ],
        { session: transactionSession }
      );
      return { teamId: team._id };
    });
    if (!result) throw new Error("TEAM_NOT_CREATED");
    return {
      teamId: result.teamId,
      invitationCode,
      invitationPath: `/events/${event._id.toString()}?invite=${encodeURIComponent(invitationCode)}`,
      accessToken,
      status: getTeamStatus(1, minTeamSize, maxTeamSize),
      currentMemberCount: 1,
      minTeamSize,
      maxTeamSize,
    };
  } finally {
    await session?.endSession();
  }
};

const joinTeamRegistration = async ({
  event,
  participant,
  invitationCode,
}: {
  event: IEvent;
  participant: RegisteredParticipant;
  invitationCode: string;
}) => {
  const { minTeamSize, maxTeamSize } = getTeamConfiguration(event);
  const accessToken = participant.type === "guest" ? generateAccessToken() : null;
  let session: ClientSession | undefined;
  try {
    session = await mongoose.startSession();
    const result = await session.withTransaction(async (transactionSession) => {
      const joinedTeam = await EventTeam.findOneAndUpdate(
        {
          eventId: event._id,
          invitationCode,
          currentMemberCount: { $lt: maxTeamSize },
        },
        { $inc: { currentMemberCount: 1 } },
        { returnDocument: "after", session: transactionSession }
      )
        .select("+invitationCode")
        .exec();
      if (!joinedTeam) {
        const existingTeam = await EventTeam.findOne({
          eventId: event._id,
          invitationCode,
        })
          .session(transactionSession)
          .select("_id currentMemberCount")
          .exec();
        throw new TeamRegistrationError(
          409,
          existingTeam ? "TEAM_FULL" : "INVALID_INVITATION_CODE",
          existingTeam
            ? "This team is already full."
            : "The invitation code is invalid for this event."
        );
      }
      const registration = await createParticipantRegistration(
        event._id,
        participant,
        transactionSession
      );
      await EventTeamMember.create(
        [
          {
            eventId: event._id,
            teamId: joinedTeam._id,
            participantType: participant.type,
            ...registration,
            isLeader: false,
            ...(accessToken ? { accessTokenHash: hashAccessToken(accessToken) } : {}),
          },
        ],
        { session: transactionSession }
      );
      return {
        teamId: joinedTeam._id,
        teamName: joinedTeam.name,
        currentMemberCount: joinedTeam.currentMemberCount,
      };
    });
    if (!result) throw new Error("TEAM_NOT_JOINED");
    return {
      teamId: result.teamId,
      teamName: result.teamName,
      accessToken,
      status: getTeamStatus(
        result.currentMemberCount,
        minTeamSize,
        maxTeamSize
      ),
      currentMemberCount: result.currentMemberCount,
      minTeamSize,
      maxTeamSize,
    };
  } finally {
    await session?.endSession();
  }
};

const mapTeamError = async (error: unknown, eventId: string, res: Response) => {
  if (error instanceof TeamRegistrationError) {
    if (error.code === "EVENT_NOT_REGISTERABLE") {
      const event = await Event.findById(eventId).exec();
      if (!event) {
        return res.status(404).json({
          success: false,
          code: "EVENT_NOT_FOUND",
          message: "Event not found.",
        });
      }
      const status = getEventStatus(event);
      return res.status(409).json({
        success: false,
        code:
          status === "full"
            ? "EVENT_FULL"
            : status === "past" || status === "ongoing"
              ? "EVENT_PAST"
              : "REGISTRATION_CLOSED",
        message:
          status === "full"
            ? "Registration is full for this event."
            : status === "past" || status === "ongoing"
              ? "This event has already started."
              : "Registration is closed for this event.",
      });
    }
    return res.status(error.status).json({
      success: false,
      code: error.code,
      message: error.message,
    });
  }
  if (isDuplicateKeyError(error)) {
    const duplicateKey = getDuplicateKey(error);
    if (duplicateKey.includes("normalizedName")) {
      return res.status(409).json({
        success: false,
        code: "TEAM_NAME_EXISTS",
        message: "A team with this name already exists for the event.",
      });
    }
    if (duplicateKey.includes("invitationCode")) {
      return res.status(409).json({
        success: false,
        code: "INVITATION_CODE_COLLISION",
        message: "Unable to create a unique invitation code. Please try again.",
      });
    }
    return res.status(409).json({
      success: false,
      code: "ALREADY_REGISTERED",
      message: "This participant is already registered for the event.",
    });
  }
  return res.status(500).json({
    success: false,
    message: "Unexpected server error.",
  });
};

const loadEventForTeamAction = async (
  eventId: string,
  action: "create" | "join"
) => {
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    throw new TeamRegistrationError(
      400,
      "INVALID_EVENT_ID",
      "A valid event id is required."
    );
  }
  const event = await Event.findById(eventId).exec();
  if (!event) {
    throw new TeamRegistrationError(404, "EVENT_NOT_FOUND", "Event not found.");
  }
  getTeamConfiguration(event);

  if (action === "create") {
    ensureEventCanRegister(event);
  } else {
    const now = new Date();

    if (
      event.published === false ||
      !isEventRegistrationWindowOpen(event, now)
    ) {
      throw new TeamRegistrationError(
        409,
        "REGISTRATION_CLOSED",
        "Registration is closed for this event."
      );
    }
  }

  return event;
};

const ensureGuestCanRegister = async (
  event: IEvent,
  guest: GuestParticipant
) => {
  if (getEventEligibility(event) !== "public") {
    throw new TeamRegistrationError(
      401,
      "MEMBERS_ONLY_EVENT",
      "Sign in with an active club account to register for this event."
    );
  }
  if (await User.exists({ email: guest.email })) {
    throw new TeamRegistrationError(
      409,
      "ACCOUNT_EMAIL_REQUIRES_LOGIN",
      "This email belongs to a club account. Sign in to continue."
    );
  }
  if (await GuestEventRegistration.exists({ eventId: event._id, email: guest.email })) {
    throw new TeamRegistrationError(
      409,
      "ALREADY_REGISTERED",
      "This participant is already registered for the event."
    );
  }
};

const handleTeamAction = async (
  req: Request<{ eventId: string }, unknown, TeamRequestBody>,
  res: Response,
  action: TeamAction
) => {
  const authenticatedFields = [
    ...(action === "create" ? ["teamName"] : ["invitationCode"]),
    "contactNumber",
    "branch",
  ];
  const guestFields = [
    ...authenticatedFields,
    "name",
    "email",
  ];
  if (!assertAllowedBody(req.body, req.auth ? authenticatedFields : guestFields)) {
    return res.status(400).json({
      success: false,
      code: "INVALID_TEAM_REGISTRATION",
      message: "Only team registration fields are allowed.",
    });
  }

  try {
    const event = await loadEventForTeamAction(req.params.eventId, action);
    const teamName = normalizeString(req.body.teamName);
    const invitationCode = normalizeString(req.body.invitationCode);
    if (action === "create" && (teamName.length < 2 || teamName.length > 80)) {
      throw new TeamRegistrationError(
        400,
        "INVALID_TEAM_NAME",
        "Team name must contain 2 to 80 characters."
      );
    }
    if (action === "join" && !invitationCode) {
      throw new TeamRegistrationError(
        400,
        "INVALID_INVITATION_CODE",
        "Enter a valid invitation code."
      );
    }

    const student = await loadAuthenticatedParticipant(req);
    if (!student) {
      const guest = parseGuest(req.body);
      if (!guest) {
        throw new TeamRegistrationError(
          400,
          "INVALID_PARTICIPANT",
          "Enter your name, valid email, Indian mobile number, and branch name."
        );
      }
      if (action === "join") {
        const team = await EventTeam.findOne({
          eventId: event._id,
          invitationCode,
        })
          .select("_id currentMemberCount")
          .exec();
        if (!team) {
          throw new TeamRegistrationError(
            404,
            "INVALID_INVITATION_CODE",
            "The invitation code is invalid for this event."
          );
        }
        if (team.currentMemberCount >= event.maxTeamSize!) {
          throw new TeamRegistrationError(409, "TEAM_FULL", "This team is already full.");
        }
      }
      await ensureGuestCanRegister(event, guest);
      const participant: RegisteredParticipant = {
        type: "guest",
        branch: guest.branch ?? "",
        guest,
      };
      const result =
        action === "create"
          ? await createTeamRegistration({ event, participant, teamName })
          : await joinTeamRegistration({ event, participant, invitationCode });
      return res.status(201).json({
        success: true,
        message:
          action === "create"
            ? "Team created successfully."
            : "You joined the team successfully.",
        team: result,
      });
    }

    if (
      await GuestEventRegistration.exists({
        eventId: event._id,
        email: student.email,
      })
    ) {
      throw new TeamRegistrationError(
        409,
        "ALREADY_REGISTERED",
        "This participant is already registered for the event."
      );
    }

    const hasSubmittedContact = Object.prototype.hasOwnProperty.call(
      req.body,
      "contactNumber"
    );
    const submittedContact = hasSubmittedContact
      ? normalizeIndianContactNumber(req.body.contactNumber)
      : null;
    if (hasSubmittedContact && !submittedContact) {
      throw new TeamRegistrationError(
        400,
        "INVALID_CONTACT_NUMBER",
        "Enter a valid Indian mobile number."
      );
    }
    const contactNumber =
      submittedContact ?? normalizeIndianContactNumber(student.contactNumber);
    if (!contactNumber) {
      throw new TeamRegistrationError(
        400,
        "CONTACT_NUMBER_REQUIRED",
        "Enter a valid Indian mobile number for event coordination."
      );
    }
    const branch = normalizeString(req.body.branch) || normalizeString(student.branch);
    if (branch.length < 2 || branch.length > 160) {
      throw new TeamRegistrationError(
        400,
        "BRANCH_REQUIRED",
        "Enter a valid branch name for event registration."
      );
    }

    const participant: RegisteredParticipant = {
      type: "member",
      studentId: student._id,
      contactNumber,
      branch,
      guest: null,
    };
    const result =
      action === "create"
        ? await createTeamRegistration({ event, participant, teamName })
        : await joinTeamRegistration({ event, participant, invitationCode });
    return res.status(201).json({
      success: true,
      message:
        action === "create"
          ? "Team created successfully."
          : "You joined the team successfully.",
      team: result,
    });
  } catch (error) {
    return mapTeamError(error, req.params.eventId, res);
  }
};

export const createEventTeam = (
  req: Request<{ eventId: string }, unknown, TeamRequestBody>,
  res: Response
) => handleTeamAction(req, res, "create");

export const joinEventTeam = (
  req: Request<{ eventId: string }, unknown, TeamRequestBody>,
  res: Response
) => handleTeamAction(req, res, "join");

export const previewEventTeamInvitation = async (
  req: Request<{ eventId: string; invitationCode: string }>,
  res: Response
) => {
  const { eventId, invitationCode } = req.params;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({
      success: false,
      code: "INVALID_EVENT_ID",
      message: "A valid event id is required.",
    });
  }
  if (!/^[A-Za-z0-9_-]{32}$/.test(invitationCode)) {
    return res.status(404).json({
      success: false,
      code: "INVALID_INVITATION_CODE",
      message: "The invitation link is invalid.",
    });
  }

  try {
    const event = await Event.findById(eventId).exec();
    if (!event || event.published === false) {
      return res.status(404).json({
        success: false,
        code: "INVITATION_NOT_FOUND",
        message: "The invitation link is invalid.",
      });
    }
    const { minTeamSize, maxTeamSize } = getTeamConfiguration(event);
    if (getEventEligibility(event) === "members_only") {
      const member = await loadAuthenticatedParticipant(req);
      if (!member) {
        return res.status(401).json({
          success: false,
          code: "AUTH_REQUIRED",
          message: "Sign in with an active club account to view this invitation.",
        });
      }
    }

    const team = await EventTeam.findOne({
      eventId: event._id,
      invitationCode,
    }).exec();
    if (!team) {
      return res.status(404).json({
        success: false,
        code: "INVITATION_NOT_FOUND",
        message: "The invitation link is invalid.",
      });
    }

    const availableSlots = Math.max(0, maxTeamSize - team.currentMemberCount);
    return res.status(200).json({
      success: true,
      invitation: {
        event: {
          name: event.title,
        },
        team: {
          name: team.name,
          availableSlots,
          status: getTeamStatus(
            team.currentMemberCount,
            minTeamSize,
            maxTeamSize
          ),
        },
        registrationOpen:
          isEventRegistrationWindowOpen(event) &&
          availableSlots > 0,
      },
    });
  } catch (error) {
    return mapTeamError(error, eventId, res);
  }
};

type PopulatedMember = {
  _id: unknown;
  participantType: "member" | "guest";
  isLeader: boolean;
  createdAt: Date;
  studentId?: {
    _id?: unknown;
    name?: string;
    email?: string;
    usn?: string;
    contactNumber?: string;
    branch?: string;
    year?: number;
  };
  eventRegistrationId?: {
    _id?: unknown;
    contactNumber?: string;
    branch?: string;
  };
  guestRegistrationId?: {
    _id?: unknown;
    name?: string;
    email?: string;
    contactNumber?: string;
    branch?: string;
  };
};

const loadTeamMembers = async (teamId: Types.ObjectId) =>
  EventTeamMember.find({ teamId })
    .sort({ isLeader: -1, createdAt: 1 })
    .populate<{ studentId?: PopulatedMember["studentId"] }>(
      "studentId",
      TEAM_MEMBER_FIELDS
    )
    .populate<{
      eventRegistrationId?: PopulatedMember["eventRegistrationId"];
    }>("eventRegistrationId", "contactNumber branch")
    .populate<{ guestRegistrationId?: PopulatedMember["guestRegistrationId"] }>(
      "guestRegistrationId",
      "name email contactNumber branch"
    )
    .lean<PopulatedMember[]>()
    .exec();

const loadParticipantTeamMembers = async (teamId: Types.ObjectId) =>
  EventTeamMember.find({ teamId })
    .sort({ isLeader: -1, createdAt: 1 })
    .populate<{ studentId?: Pick<NonNullable<PopulatedMember["studentId"]>, "name"> }>(
      "studentId",
      "name"
    )
    .populate<{
      guestRegistrationId?: Pick<
        NonNullable<PopulatedMember["guestRegistrationId"]>,
        "name"
      >;
    }>("guestRegistrationId", "name")
    .lean<PopulatedMember[]>()
    .exec();

const toParticipantMember = (member: PopulatedMember) => {
  const participant =
    member.participantType === "member"
      ? member.studentId
      : member.guestRegistrationId;

  return {
    name: participant?.name ?? "Unknown participant",
    role: member.isLeader ? "leader" : "member",
  };
};

const toSafeMember = (
  member: PopulatedMember,
  includeParticipantDetails: boolean,
  includeContactDetails = false
) => {
  const participant =
    member.participantType === "member"
      ? member.studentId
      : member.guestRegistrationId;
  return {
    id: String(member._id),
    name: participant?.name ?? "Unknown participant",
    ...(includeParticipantDetails
      ? {
        email: participant?.email ?? "",
        usn: member.studentId?.usn ?? "",
        branch:
          member.eventRegistrationId?.branch ??
          member.guestRegistrationId?.branch ??
          member.studentId?.branch ??
          "",
        year: member.studentId?.year ?? null,
      }
      : {}),
    ...(includeContactDetails
      ? {
        contactNumber:
          member.eventRegistrationId?.contactNumber ??
          participant?.contactNumber ??
          "",
      }
      : {}),
    participantType: member.participantType,
    isLeader: member.isLeader,
    joinedAt: member.createdAt,
  };
};

export const getMyEventTeam = async (
  req: Request<{ eventId: string }>,
  res: Response
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
    return res.status(400).json({ success: false, code: "INVALID_EVENT_ID", message: "A valid event id is required." });
  }
  try {
    const event = await Event.findById(req.params.eventId).exec();
    if (!event) return res.status(404).json({ success: false, code: "EVENT_NOT_FOUND", message: "Event not found." });
    const accessToken = normalizeString(req.headers["x-team-access-token"]);
    const student = req.auth ? await loadAuthenticatedParticipant(req) : null;
    const member = student
      ? await EventTeamMember.findOne({ eventId: event._id, studentId: student._id }).exec()
      : accessToken
        ? await EventTeamMember.findOne({ eventId: event._id, accessTokenHash: hashAccessToken(accessToken) }).exec()
        : null;
    if (!member) {
      return res.status(404).json({ success: false, code: "TEAM_MEMBERSHIP_NOT_FOUND", message: "No team membership was found for this participant." });
    }
    const teamQuery = EventTeam.findById(member.teamId);
    if (member.isLeader) teamQuery.select("+invitationCode");
    const team = await teamQuery.exec();
    if (!team) return res.status(404).json({ success: false, code: "TEAM_NOT_FOUND", message: "Team not found." });
    const { minTeamSize, maxTeamSize } = getTeamConfiguration(event);
    const members = await loadParticipantTeamMembers(team._id);
    return res.status(200).json({
      success: true,
      team: {
        name: team.name,
        status: getTeamStatus(team.currentMemberCount, minTeamSize, maxTeamSize),
        currentMemberCount: team.currentMemberCount,
        minTeamSize,
        maxTeamSize,
        role: member.isLeader ? "leader" : "member",
        ...(member.isLeader
          ? {
            invitationCode: team.invitationCode,
            invitationPath: `/events/${event._id.toString()}?invite=${encodeURIComponent(team.invitationCode)}`,
          }
          : {}),
        members: members.map(toParticipantMember),
      },
    });
  } catch (error) {
    return mapTeamError(error, req.params.eventId, res);
  }
};

const loadAdminTeams = async (event: IEvent) => {
  const { minTeamSize, maxTeamSize } = getTeamConfiguration(event);
  const teams = await EventTeam.find({ eventId: event._id })
    .sort({ createdAt: 1 })
    .exec();
  return Promise.all(
    teams.map(async (team) => {
      const members = await loadTeamMembers(team._id);
      return {
        id: team._id.toString(),
        name: team.name,
        status: getTeamStatus(team.currentMemberCount, minTeamSize, maxTeamSize),
        currentMemberCount: team.currentMemberCount,
        minTeamSize,
        maxTeamSize,
        createdAt: team.createdAt,
        members: members.map((member) => toSafeMember(member, true, true)),
      };
    })
  );
};

export const getAdminEventTeams = async (
  req: Request<{ eventId: string }>,
  res: Response
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
    return res.status(400).json({ success: false, code: "INVALID_EVENT_ID", message: "A valid event id is required." });
  }
  try {
    const event = await Event.findById(req.params.eventId).exec();
    if (!event) return res.status(404).json({ success: false, code: "EVENT_NOT_FOUND", message: "Event not found." });
    if (getEventParticipationType(event) !== "team") {
      return res.status(400).json({ success: false, code: "TEAM_EVENT_REQUIRED", message: "This event does not use team registration." });
    }
    const teams = await loadAdminTeams(event);
    return res.status(200).json({
      success: true,
      event: { id: event._id.toString(), title: event.title, registrationCount: event.registrationCount, maxRegistrations: event.maxRegistrations },
      teams,
    });
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unexpected server error." });
  }
};

export const exportAdminEventTeams = async (
  req: Request<{ eventId: string }>,
  res: Response
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.eventId)) {
    return res.status(400).json({ success: false, code: "INVALID_EVENT_ID", message: "A valid event id is required." });
  }
  try {
    const event = await Event.findById(req.params.eventId).exec();
    if (!event) return res.status(404).json({ success: false, code: "EVENT_NOT_FOUND", message: "Event not found." });
    if (getEventParticipationType(event) !== "team") {
      return res.status(400).json({ success: false, code: "TEAM_EVENT_REQUIRED", message: "This event does not use team registration." });
    }
    const teams = await loadAdminTeams(event);
    const workbook = new ExcelJS.Workbook();
    workbook.creator = "HackerEarth Hub NMAMIT";
    const worksheet = workbook.addWorksheet("Teams");
    worksheet.columns = [
      { header: "Team", key: "team", width: 26 },
      { header: "Status", key: "status", width: 14 },
      { header: "Member Count", key: "memberCount", width: 16 },
      { header: "Leader", key: "leader", width: 24 },
      { header: "Member", key: "member", width: 24 },
      { header: "USN", key: "usn", width: 16 },
      { header: "Email", key: "email", width: 32 },
      { header: "Phone Number", key: "contactNumber", width: 18 },
      { header: "Branch", key: "branch", width: 24 },
      { header: "Year", key: "year", width: 10 },
      { header: "Joined At", key: "joinedAt", width: 22 },
    ];
    worksheet.getRow(1).font = { bold: true };
    for (const team of teams) {
      const leader = team.members.find((member) => member.isLeader)?.name ?? "";
      for (const member of team.members) {
        worksheet.addRow({
          team: team.name,
          status: team.status,
          memberCount: team.currentMemberCount,
          leader,
          member: member.name,
          usn: member.usn,
          email: member.email,
          contactNumber: member.contactNumber,
          branch: member.branch,
          year: member.year ?? "",
          joinedAt: member.joinedAt,
        });
      }
    }
    worksheet.getColumn("joinedAt").numFmt = "yyyy-mm-dd hh:mm";
    const filename = `${event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "event"}-teams.xlsx`;
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    await workbook.xlsx.write(res);
    res.end();
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Unexpected server error." });
  }
};
