import mongoose, { ClientSession, Types } from "mongoose";
import Event from "../models/Event";
import EventTeam from "../models/EventTeam";

export interface EventTeamCountReconciliationResult {
  eventId: string;
  title: string;
  storedCount: number;
  actualTeamCount: number;
  changed: boolean;
}

export interface EventTeamCountReconciliationArguments {
  applyChanges: boolean;
  eventIds: string[];
}

export class ReconciliationInputError extends Error {
  constructor(
    public readonly code:
      | "INVALID_EVENT_ID_ARGUMENT"
      | "APPLY_REQUIRES_EVENT_IDS"
  ) {
    super(code);
    this.name = "ReconciliationInputError";
  }
}

export class TeamEventNotFoundError extends Error {
  constructor(public readonly eventId: string) {
    super("TEAM_EVENT_NOT_FOUND");
    this.name = "TeamEventNotFoundError";
  }
}

class ConcurrentEventUpdateError extends Error {
  constructor() {
    super("CONCURRENT_EVENT_UPDATE");
    this.name = "ConcurrentEventUpdateError";
  }
}

export const parseReconciliationArguments = (
  args: string[]
): EventTeamCountReconciliationArguments => {
  const applyChanges = args.includes("--apply");
  const eventIds = [
    ...new Set(
      args
        .filter((argument) => argument.startsWith("--event-id="))
        .map((argument) => argument.slice("--event-id=".length).trim())
        .filter(Boolean)
    ),
  ];

  if (eventIds.some((eventId) => !mongoose.Types.ObjectId.isValid(eventId))) {
    throw new ReconciliationInputError("INVALID_EVENT_ID_ARGUMENT");
  }
  if (applyChanges && eventIds.length === 0) {
    throw new ReconciliationInputError("APPLY_REQUIRES_EVENT_IDS");
  }

  return { applyChanges, eventIds };
};

export const inspectEventTeamCounts = async (
  eventIds: string[]
): Promise<EventTeamCountReconciliationResult[]> => {
  const filter = {
    participationType: "team" as const,
    ...(eventIds.length > 0
      ? { _id: { $in: eventIds.map((eventId) => new Types.ObjectId(eventId)) } }
      : {}),
  };
  const events = await Event.find(filter)
    .select("_id title registrationCount")
    .sort({ eventDateTime: 1 })
    .exec();

  const results: EventTeamCountReconciliationResult[] = [];
  for (const event of events) {
    const actualTeamCount = await EventTeam.countDocuments({
      eventId: event._id,
    }).exec();
    results.push({
      eventId: event._id.toString(),
      title: event.title,
      storedCount: event.registrationCount,
      actualTeamCount,
      changed: event.registrationCount !== actualTeamCount,
    });
  }
  return results;
};

const reconcileWithinTransaction = async (
  eventIds: string[],
  session: ClientSession
): Promise<EventTeamCountReconciliationResult[]> => {
  const results: EventTeamCountReconciliationResult[] = [];

  for (const eventId of eventIds) {
    const event = await Event.findOne({
      _id: new Types.ObjectId(eventId),
      participationType: "team",
    })
      .select("_id title registrationCount")
      .session(session)
      .exec();

    if (!event) throw new TeamEventNotFoundError(eventId);

    const actualTeamCount = await EventTeam.countDocuments({
      eventId: event._id,
    }).session(session);
    const storedCount = event.registrationCount;

    if (storedCount !== actualTeamCount) {
      const updateResult = await Event.updateOne(
        {
          _id: event._id,
          participationType: "team",
          registrationCount: storedCount,
        },
        { $set: { registrationCount: actualTeamCount } },
        { session }
      ).exec();

      if (updateResult.modifiedCount !== 1) {
        throw new ConcurrentEventUpdateError();
      }
    }

    results.push({
      eventId: event._id.toString(),
      title: event.title,
      storedCount,
      actualTeamCount,
      changed: storedCount !== actualTeamCount,
    });
  }

  return results;
};

export const applyEventTeamCountReconciliation = async (
  eventIds: string[]
): Promise<EventTeamCountReconciliationResult[]> => {
  if (eventIds.length === 0) {
    throw new ReconciliationInputError("APPLY_REQUIRES_EVENT_IDS");
  }

  const maximumGuardRetries = 3;
  for (let attempt = 1; attempt <= maximumGuardRetries; attempt += 1) {
    const session = await mongoose.startSession();
    try {
      const results = await session.withTransaction(
        () => reconcileWithinTransaction(eventIds, session),
        {
          readConcern: { level: "snapshot" },
          writeConcern: { w: "majority" },
        }
      );
      if (!results) throw new Error("RECONCILIATION_ABORTED");
      return results;
    } catch (error) {
      if (!(error instanceof ConcurrentEventUpdateError) || attempt === maximumGuardRetries) {
        throw error;
      }
    } finally {
      await session.endSession();
    }
  }

  throw new Error("RECONCILIATION_ABORTED");
};
