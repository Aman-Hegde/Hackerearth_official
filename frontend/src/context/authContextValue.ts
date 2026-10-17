import { createContext, useContext } from "react";

export type UserRole = "student" | "admin";
export type EnrolledDomain = "Web Development" | "DSA" | "Aptitude";

export interface User {
  id: string;
  name: string;
  email: string;
  usn: string;
  contactNumber: string;
  branch: string;
  year: number;
  enrolledDomains: EnrolledDomain[];
  role: UserRole;
  emailVerified: boolean;
  isActive?: boolean;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
