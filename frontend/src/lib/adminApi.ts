import { apiRequest } from './api';

export interface AdminOverview {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  totalAdmins: number;
  verifiedStudents: number;
  registrationOpen: boolean;
}

export interface AdminStudent {
  id: string;
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  branch: string;
  year: number;
  enrolledDomains: Array<'Web Development' | 'DSA' | 'Aptitude'>;
  role: 'student';
  emailVerified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface StudentPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface RegistrationSettings {
  id: string;
  key: string;
  studentRegistrationOpen: boolean;
  registrationMessage: string;
  registrationOpensAt?: string | null;
  registrationClosesAt?: string | null;
  registrationOpen: boolean;
  updatedBy?: string;
  createdAt: string;
  updatedAt: string;
}

interface OverviewResponse {
  success: true;
  overview: AdminOverview;
}

interface StudentsResponse {
  success: true;
  students: AdminStudent[];
  pagination: StudentPagination;
}

interface StudentStatusResponse {
  success: true;
  message: string;
  student: AdminStudent;
}

interface RegistrationSettingsResponse {
  success: true;
  settings: RegistrationSettings;
}

interface RegistrationUpdateResponse extends RegistrationSettingsResponse {
  message: string;
}

export interface StudentListParams {
  page: number;
  limit: number;
  search?: string;
  branch?: string;
  year?: number;
  status?: 'active' | 'inactive';
}

export const getAdminOverview = (signal?: AbortSignal) =>
  apiRequest<OverviewResponse>('/api/admin/overview', {
    credentials: 'include',
    signal,
  });

export const getAdminStudents = (
  params: StudentListParams,
  signal?: AbortSignal,
) => {
  const query = new URLSearchParams({
    page: String(params.page),
    limit: String(params.limit),
  });

  if (params.search?.trim()) query.set('search', params.search.trim());
  if (params.branch?.trim()) query.set('branch', params.branch.trim());
  if (params.year) query.set('year', String(params.year));
  if (params.status) query.set('status', params.status);

  return apiRequest<StudentsResponse>(`/api/admin/students?${query.toString()}`, {
    credentials: 'include',
    signal,
  });
};

export const updateAdminStudentStatus = (
  studentId: string,
  isActive: boolean,
) =>
  apiRequest<StudentStatusResponse>(
    `/api/admin/students/${encodeURIComponent(studentId)}/status`,
    {
      method: 'PATCH',
      credentials: 'include',
      body: JSON.stringify({ isActive }),
    },
  );

export const getAdminRegistrationSettings = (signal?: AbortSignal) =>
  apiRequest<RegistrationSettingsResponse>('/api/admin/settings/registration', {
    credentials: 'include',
    signal,
  });

export const updateAdminRegistrationSettings = (
  studentRegistrationOpen: boolean,
  registrationMessage: string,
) =>
  apiRequest<RegistrationUpdateResponse>('/api/admin/settings/registration', {
    method: 'PATCH',
    credentials: 'include',
    body: JSON.stringify({
      studentRegistrationOpen,
      registrationMessage,
    }),
  });
