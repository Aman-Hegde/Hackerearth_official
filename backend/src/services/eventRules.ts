import type { IEvent } from "../models/Event";

export type EventStatus = "open" | "full" | "closed" | "ongoing" | "past";
export type EventParticipationType = "individual" | "team";
export type EventEligibility = "members_only" | "public";

type EventRuleInput = Pick<
  IEvent,
  | "eventDateTime"
  | "eventEndDateTime"
  | "registrationDeadline"
  | "registrationCount"
  | "maxRegistrations"
  | "active"
>;

export const getEventParticipationType = (
  event: Pick<IEvent, "participationType">
): EventParticipationType => event.participationType ?? "individual";

// Events created before Events V3 accepted guests, so missing eligibility is public.
export const getEventEligibility = (
  event: Pick<IEvent, "eligibility">
): EventEligibility => event.eligibility ?? "public";

export const getEventStatus = (
  event: EventRuleInput,
  now = new Date()
): EventStatus => {
  const eventEndDateTime =
    event.eventEndDateTime instanceof Date &&
    !Number.isNaN(event.eventEndDateTime.getTime())
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

export const isEventRegistrationOpen = (
  event: EventRuleInput,
  now = new Date()
) => getEventStatus(event, now) === "open";

export const getTeamStatus = (
  currentMemberCount: number,
  minTeamSize: number,
  maxTeamSize: number
) => {
  if (currentMemberCount >= maxTeamSize) return "full" as const;
  if (currentMemberCount >= minTeamSize) return "complete" as const;
  return "forming" as const;
};

export const normalizeIndianContactNumber = (value: unknown): string | null => {
  if (typeof value !== "string") return null;
  const contactNumber = value.trim();
  if (/^[6-9]\d{9}$/.test(contactNumber)) return contactNumber;
  if (/^(?:\+91|91)[6-9]\d{9}$/.test(contactNumber)) {
    return contactNumber.slice(-10);
  }
  return null;
};
