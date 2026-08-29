import type { EnrolledDomain, User } from "../context/AuthContext";
import { apiRequest } from "./api";

export interface UpdateStudentProfileInput {
  name: string;
  contactNumber: string;
  enrolledDomains: EnrolledDomain[];
}

interface UpdateStudentProfileResponse {
  success: boolean;
  message: string;
  user: User;
}

export const updateStudentProfile = (input: UpdateStudentProfileInput) =>
  apiRequest<UpdateStudentProfileResponse>("/api/student/profile", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
