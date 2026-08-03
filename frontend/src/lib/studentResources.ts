import type { EnrolledDomain, User } from '../context/AuthContext';
import type { BlogPost } from './resourcesData';

export const STUDENT_RESOURCE_ORIGIN = 'student-dashboard';

const domainCategory: Record<EnrolledDomain, BlogPost['category']> = {
  'Web Development': 'web',
  DSA: 'dsa',
  Aptitude: 'aptitude',
};

export const getEnrolledResourceCategories = (user: User | null) =>
  new Set<BlogPost['category']>(
    user?.enrolledDomains.map((domain) => domainCategory[domain]) ?? [],
  );

export const isStudentResourceOrigin = (
  search: string,
  state: unknown,
) => {
  const searchOrigin = new URLSearchParams(search).get('from');
  const stateOrigin = (state as { fromStudentDashboard?: boolean } | null)
    ?.fromStudentDashboard;

  return searchOrigin === STUDENT_RESOURCE_ORIGIN || stateOrigin === true;
};

export const studentResourceSearch = `?from=${STUDENT_RESOURCE_ORIGIN}`;
export const studentResourceState = { fromStudentDashboard: true } as const;
