"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getMe,
  login as apiLogin,
  setAuthToken,
  refreshToken as apiRefreshToken,
} from "../lib/api";
import api from "../lib/api";

type User = {
  id: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  });
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        setAuthToken(token);
        const data = await getMe();
        setUser(data.data?.user || data.data || data.user || data);
      } catch (err) {
        console.error("getMe failed", err);
        setUser(null);
      }
    })();
  }, [token]);

  // Try to refresh token silently on mount if no token stored
  useEffect(() => {
    if (token) return;
    (async () => {
      try {
        const res = await apiRefreshToken();
        const t =
          res?.data?.accessToken ||
          res?.accessToken ||
          (res?.data && res.data.accessToken) ||
          null;
        if (t) {
          localStorage.setItem("token", t);
          setAuthToken(t);
          setToken(t);
        }
      } catch (err) {
        // no-op
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    // server responses are shaped { success, data: { user, accessToken }, message }
    const t =
      res?.data?.accessToken ||
      (res?.data && res.data.accessToken) ||
      res?.accessToken ||
      null;
    if (!t) throw new Error("No token returned from login");
    localStorage.setItem("token", t);
    setAuthToken(t);
    setToken(t);
  };

  const logout = () => {
    (async () => {
      try {
        // use axios instance so Authorization header is included
        await api.post("/auth/logout");
      } catch (err) {
        // ignore
      } finally {
        localStorage.removeItem("token");
        setAuthToken(null);
        setToken(null);
        setUser(null);
        // redirect to home so user leaves authenticated area
        try {
          if (typeof window !== "undefined") window.location.href = "/";
        } catch (e) {
          // ignore
        }
      }
    })();
  };

  // listen to token refresh events dispatched by the api interceptor
  useEffect(() => {
    const handler = (e: Event) => {
      try {
        const detail = (e as CustomEvent).detail as string | undefined;
        if (detail) {
          setToken(detail);
        }
      } catch (e) {
        // ignore
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("tokenRefreshed", handler as EventListener);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("tokenRefreshed", handler as EventListener);
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
