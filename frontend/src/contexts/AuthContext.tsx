"use client";

import useRequest from "@/hooks/useRequest";
import { request } from "@/lib/utils";
import { createContext, ReactNode, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  username: string;
  leetcodeHandle: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  streaks: number;
  levels: number;
  xp: number;
  activeAvatar: string;
  activeBackground: string;
  avatarUnlocked: string[];
  backgroundUnlocked: string[];
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const { data, isLoading } = useRequest("/auth/me", false);

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data]);

  const logout = async () => {
    setUser(null);
    await request("POST", "/auth/logout");
  };

  const value = {
    user: data ?? null,
    setUser,
    isLoading,
    isAuthenticated: !!user,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
