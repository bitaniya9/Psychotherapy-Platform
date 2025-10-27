import { useEffect } from "react";
import { useAuth as useCtxAuth } from "@/context/AuthContext";

// Lightweight wrapper so components can call `useAuth()` from hooks
export function useAuth() {
  // simply proxy to context hook
  return useCtxAuth();
}
