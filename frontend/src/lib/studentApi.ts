import type { EnrolledDomain, User } from "../context/AuthContext";
import { apiRequest } from "./api";

export interface DomainCommunity {
  domain: EnrolledDomain;
  joinUrl: string;
}

export interface UpdateStudentProfileInput {
  name: string;
  contactNumber: string;
  enrolledDomains: EnrolledDomain[];
}

interface DomainGroupsResponse {
  success: boolean;
  groups: DomainCommunity[];
}

interface UpdateStudentProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

export const getStudentDomainGroups = () =>
  apiRequest<DomainGroupsResponse>("/api/student/domain-groups");

export const updateStudentProfile = (input: UpdateStudentProfileInput) =>
  apiRequest<UpdateStudentProfileResponse>("/api/student/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
