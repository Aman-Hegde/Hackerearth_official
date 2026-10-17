import { API_BASE_URL, ApiError, apiRequest } from "./api";

export type EventStatus = "open" | "full" | "closed" | "ongoing" | "past";
export type EventParticipationType = "individual" | "team";
export type EventEligibility = "members_only" | "public";
export type EventTeamStatus = "forming" | "complete" | "full";

export interface EventSummary {
  id: string;
  tagline?: string;
  imageUrls?: string[];
  rounds?: string[];
  published?: boolean;
  title: string;
  description: string;
  venue: string;
  posterUrl: string;
  posterPublicId?: string | null;
  eventDateTime: string;
  eventEndDateTime?: string | null;
  registrationDeadline: string;
  maxRegistrations: number;
  registrationCount: number;
  participationType: EventParticipationType;
  eligibility: EventEligibility;
  minTeamSize: number | null;
  maxTeamSize: number | null;
  active: boolean;
  status: EventStatus;
  registrationOpen: boolean;
  isRegistered?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  tagline?: string;
  imageUrls?: string[];
  rounds?: string[];
  published?: boolean;
  title: string;
  description: string;
  venue: string;
  posterUrl: string;
  posterPublicId?: string;
  eventDateTime: string;
  eventEndDateTime?: string;
  registrationDeadline: string;
  maxRegistrations: number;
  participationType?: EventParticipationType;
  eligibility?: EventEligibility;
  minTeamSize?: number;
  maxTeamSize?: number;
  active?: boolean;
}

export interface AdminEventRegistrationStudent {
  id: string;
  name: string;
  usn: string;
  email: string;
  contactNumber: string;
  year: number | null;
  registeredAt: string;
}

export interface AdminEventRegistrationSummary {
  id: string;
  title: string;
  registrationCount: number;
  maxRegistrations: number;
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

interface AdminPosterUploadResponse {
  success: true;
  poster: {
    url: string;
    publicId: string;
  };
}

interface AdminEventRegistrationsResponse {
  success: true;
  event: AdminEventRegistrationSummary;
  registrations: AdminEventRegistrationStudent[];
}

const getErrorMessage = (data: unknown): string => {
  if (
    data &&
    typeof data === "object" &&
    "message" in data &&
    typeof data.message === "string"
  ) {
    return data.message;
  }

  return "Request failed. Please try again.";
};

const getErrorCode = (data: unknown): string | undefined => {
  if (
    data &&
    typeof data === "object" &&
    "code" in data &&
    typeof data.code === "string"
  ) {
    return data.code;
  }

  return undefined;
};

const parseJsonSafely = async (response: Response): Promise<unknown> => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const getFilenameFromContentDisposition = (contentDisposition: string | null) => {
  if (!contentDisposition) return null;

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) return decodeURIComponent(utf8Match[1].replace(/"/g, ""));

  const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  return filenameMatch?.[1] ?? null;
};

export const getStudentEvents = (signal?: AbortSignal) =>
  apiRequest<StudentEventsResponse>("/api/events", { signal });

export interface GuestParticipant {
  name: string;
  email: string;
  contactNumber: string;
}

export interface GuestTeamParticipant extends GuestParticipant {
  branch: string;
}

export interface TeamRegistrationInput {
  teamName?: string;
  invitationCode?: string;
  contactNumber?: string;
  name?: string;
  email?: string;
  branch: string;
}

export interface EventTeamRegistrationResult {
  teamId: string;
  teamName?: string;
  invitationCode?: string;
  invitationPath?: string;
  accessToken?: string | null;
  status: EventTeamStatus;
  currentMemberCount: number;
  minTeamSize: number;
  maxTeamSize: number;
}

export interface EventTeamMember {
  name: string;
  role: "leader" | "member";
}

export interface EventTeamDetails {
  name: string;
  status: EventTeamStatus;
  currentMemberCount: number;
  minTeamSize: number;
  maxTeamSize: number;
  role: "leader" | "member";
  invitationCode?: string;
  invitationPath?: string;
  members: EventTeamMember[];
}

export interface TeamInvitationPreview {
  event: { name: string };
  team: {
    name: string;
    availableSlots: number;
    status: EventTeamStatus;
  };
  registrationOpen: boolean;
}

export interface AdminEventTeamMember {
  id: string;
  name: string;
  participantType: "member" | "guest";
  isLeader: boolean;
  joinedAt: string;
  email: string;
  contactNumber: string;
  usn: string;
  branch: string;
  year: number | null;
}

export interface AdminEventTeam {
  id: string;
  name: string;
  status: EventTeamStatus;
  currentMemberCount: number;
  minTeamSize: number;
  maxTeamSize: number;
  createdAt: string;
  members: AdminEventTeamMember[];
}

export type AdminEventTeamsSummary = AdminEventRegistrationSummary;

const getTeamAccessStorageKey = (eventId: string) =>
  `hackerearth-hub:event-team-access:${eventId}`;

export const getEventTeamAccessToken = (eventId: string) => {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(getTeamAccessStorageKey(eventId));
};

export const storeEventTeamAccessToken = (eventId: string, token: string) => {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(getTeamAccessStorageKey(eventId), token);
};

interface TeamRegistrationResponse {
  success: true;
  message: string;
  team: EventTeamRegistrationResult;
}

interface EventTeamResponse {
  success: true;
  team: EventTeamDetails;
}

interface InvitationPreviewResponse {
  success: true;
  invitation: TeamInvitationPreview;
}

interface AdminEventTeamsResponse {
  success: true;
  event: AdminEventTeamsSummary;
  teams: AdminEventTeam[];
}

export const registerForEvent = (eventId: string, participant?: GuestParticipant) =>
  apiRequest<StudentEventRegistrationResponse>(
    `/api/events/${encodeURIComponent(eventId)}/register`,
    {
      method: "POST",
      body: JSON.stringify(participant ?? {}),
    }
  );

export const createEventTeam = (eventId: string, input: TeamRegistrationInput) =>
  apiRequest<TeamRegistrationResponse>(
    `/api/events/${encodeURIComponent(eventId)}/teams`,
    { method: "POST", body: JSON.stringify(input) }
  );

export const joinEventTeam = (eventId: string, input: TeamRegistrationInput) =>
  apiRequest<TeamRegistrationResponse>(
    `/api/events/${encodeURIComponent(eventId)}/teams/join`,
    { method: "POST", body: JSON.stringify(input) }
  );

export const previewEventTeamInvitation = (
  eventId: string,
  invitationCode: string,
  signal?: AbortSignal
) => apiRequest<InvitationPreviewResponse>(
  `/api/events/${encodeURIComponent(eventId)}/teams/invitations/${encodeURIComponent(invitationCode)}`,
  { signal }
);

export const getMyEventTeam = (
  eventId: string,
  accessToken?: string,
  signal?: AbortSignal
) => apiRequest<EventTeamResponse>(
  `/api/events/${encodeURIComponent(eventId)}/team`,
  {
    signal,
    headers: accessToken ? { "X-Team-Access-Token": accessToken } : undefined,
  }
);

export const getAdminEvents = (signal?: AbortSignal) =>
  apiRequest<AdminEventsResponse>("/api/admin/events", { signal });

export const uploadAdminEventPoster = async (file: File) => {
  const formData = new FormData();
  formData.append("poster", file);

  const response = await fetch(`${API_BASE_URL}/api/admin/events/poster`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await parseJsonSafely(response);

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      code: getErrorCode(data),
      message: getErrorMessage(data),
      data,
    });
  }

  return data as AdminPosterUploadResponse;
};

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

export const getAdminEventRegistrations = (eventId: string, signal?: AbortSignal) =>
  apiRequest<AdminEventRegistrationsResponse>(
    `/api/admin/events/${encodeURIComponent(eventId)}/registrations`,
    { signal }
  );

export const archiveAdminEvent = (eventId: string) =>
  apiRequest<AdminEventResponse>(
    `/api/admin/events/${encodeURIComponent(eventId)}/archive`,
    { method: "PATCH" }
  );

export const restoreAdminEvent = (eventId: string) =>
  apiRequest<AdminEventResponse>(
    `/api/admin/events/${encodeURIComponent(eventId)}/restore`,
    { method: "PATCH" }
  );

export const getAdminEventTeams = (eventId: string, signal?: AbortSignal) =>
  apiRequest<AdminEventTeamsResponse>(
    `/api/admin/events/${encodeURIComponent(eventId)}/teams`,
    { signal }
  );

export const downloadAdminEventRegistrations = async (
  eventId: string
): Promise<{ blob: Blob; filename: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/events/${encodeURIComponent(eventId)}/registrations/export`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const data = await parseJsonSafely(response);
    throw new ApiError({
      status: response.status,
      code: getErrorCode(data),
      message: getErrorMessage(data),
      data,
    });
  }

  const blob = await response.blob();
  const filename =
    getFilenameFromContentDisposition(response.headers.get("Content-Disposition")) ??
    "event-registrations.xlsx";

  return { blob, filename };
};

export const downloadAdminEventTeams = async (
  eventId: string
): Promise<{ blob: Blob; filename: string }> => {
  const response = await fetch(
    `${API_BASE_URL}/api/admin/events/${encodeURIComponent(eventId)}/teams/export`,
    { method: "GET", credentials: "include" }
  );

  if (!response.ok) {
    const data = await parseJsonSafely(response);
    throw new ApiError({
      status: response.status,
      code: getErrorCode(data),
      message: getErrorMessage(data),
      data,
    });
  }

  return {
    blob: await response.blob(),
    filename:
      getFilenameFromContentDisposition(response.headers.get("Content-Disposition")) ??
      "event-teams.xlsx",
  };
};

export const importProjectDoomsday = () =>
  apiRequest<AdminEventResponse>("/api/admin/events/import/project-doomsday", { method: "POST" });
