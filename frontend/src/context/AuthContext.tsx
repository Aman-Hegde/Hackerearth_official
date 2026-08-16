import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, apiRequest } from "../lib/api";

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
}

interface UserResponse {
  success: boolean;
  user: User;
}

interface LoginResponse extends UserResponse {
  message: string;
  redirectTo: string;
}

const STUDENT_COMMUNITY_POPUP_KEY_PREFIX =
  "hackerearth-hub:student-community-popup:";

const clearStudentCommunityPopupSessionKeys = () => {
  try {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith(STUDENT_COMMUNITY_POPUP_KEY_PREFIX)) {
        sessionStorage.removeItem(key);
      }
    });
  } catch {
    // Session storage can be unavailable in restricted browser contexts.
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const data = await apiRequest<UserResponse>("/api/auth/me");
      setUser(data.user);
      return data.user;
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setUser(null);
        return null;
      }

      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadSession = async () => {
      try {
        await refreshUser();
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSession();

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string): Promise<User> => {
      const data = await apiRequest<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setUser(data.user);
      return data.user;
    },
    []
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      await apiRequest<{ success: boolean; message: string }>("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      clearStudentCommunityPopupSessionKeys();
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
