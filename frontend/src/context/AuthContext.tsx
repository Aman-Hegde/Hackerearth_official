import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ApiError, apiRequest } from "../lib/api";
import { AuthContext, type User } from "./authContextValue";

export type { EnrolledDomain, User, UserRole } from "./authContextValue";

interface UserResponse {
  success: boolean;
  user: User;
}

interface LoginResponse extends UserResponse {
  message: string;
  redirectTo: string;
}

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
