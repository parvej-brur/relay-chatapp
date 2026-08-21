"use client";

import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";
import { getCurrentUser, login as loginRequest } from "@/lib/auth/auth.api";
import { clearStoredToken, readStoredToken, writeStoredToken } from "@/lib/auth/session";
import type { User } from "@/types/user";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: User | null;
  token: string | null;
  login: (input: { phone: string; name: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const restoreSession = async () => {
      const storedToken = readStoredToken();
      if (!storedToken) {
        if (active) setStatus("unauthenticated");
        return;
      }
      try {
        const restored = await getCurrentUser(storedToken);
        if (!active) return;
        setUser(restored);
        setToken(storedToken);
        setStatus("authenticated");
      } catch {
        if (!active) return;
        clearStoredToken();
        setStatus("unauthenticated");
      }
    };

    void restoreSession();

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (input: { phone: string; name: string }) => {
    const session = await loginRequest(input);
    writeStoredToken(session.token);
    setUser(session.user);
    setToken(session.token);
    setStatus("authenticated");
  }, []);

  const logout = useCallback(() => {
    clearStoredToken();
    setUser(null);
    setToken(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo(
    () => ({ status, user, token, login, logout }),
    [status, user, token, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (!context) throw new Error("useAuth must be used inside an AuthProvider");
  return context;
}
