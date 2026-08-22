"use client";

import { useEffect } from "react";
import { readStoredToken } from "@/lib/auth/session";
import { useAppDispatch } from "@/store/hooks";
import { sessionHydrated } from "@/store/sessionSlice";

// localStorage only exists on the client, so the stored token is read after mount and
// pushed into the store.
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sessionHydrated(readStoredToken()));
  }, [dispatch]);

  return children;
}
