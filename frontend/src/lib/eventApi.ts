import { apiRequest } from "./api";

export type EventStatus = "open" | "full" | "closed" | "past";

export interface EventSummary {
  id: string;
  title: string;
  description: string;
  venue: string;
  posterUrl: string;
  eventDateTime: string;
  registrationDeadline: string;
  maxRegistrations: number;
  registrationCount: number;
  active: boolean;
  status: EventStatus;
  registrationOpen: boolean;
  isRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  description: string;
  venue: string;
  posterUrl: string;
  eventDateTime: string;
  registrationDeadline: string;
  maxRegistrations: number;
  active?: boolean;
}

interface StudentEventsResponse {
  success: true;
  upcoming: EventSummary[];
  past: EventSummary[];
}

interface StudentEventRegistrationResponse {
  success: true;
  message: string;
  registrationCount: number;
  maxRegistrations: number;
}

interface AdminEventsResponse {
  success: true;
  events: EventSummary[];
}

interface AdminEventResponse {
  success: true;
  message?: string;
  event: EventSummary;
}

export const getStudentEvents = (signal?: AbortSignal) =>
  apiRequest<StudentEventsResponse>("/api/student/events", { signal });

export const registerForEvent = (eventId: string) =>
  apiRequest<StudentEventRegistrationResponse>(
    `/api/student/events/${encodeURIComponent(eventId)}/register`,
    {
      method: "POST",
    }
  );

export const getAdminEvents = (signal?: AbortSignal) =>
  apiRequest<AdminEventsResponse>("/api/admin/events", { signal });

export const createAdminEvent = (input: EventInput) =>
  apiRequest<AdminEventResponse>("/api/admin/events", {
    method: "POST",
    body: JSON.stringify(input),
  });

export const updateAdminEvent = (eventId: string, input: Partial<EventInput>) =>
  apiRequest<AdminEventResponse>(
    `/api/admin/events/${encodeURIComponent(eventId)}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  );
