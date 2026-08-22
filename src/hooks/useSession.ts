"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { authKeys, fetchCurrentUser } from "@/lib/auth/auth.api";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { chatReset } from "@/store/chatSlice";
import { signedOut } from "@/store/sessionSlice";

export type SessionStatus = "loading" | "authenticated" | "unauthenticated";

export function useSession() {
  const { token, hydrated } = useAppSelector((state) => state.session);
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const userQuery = useQuery({
    queryKey: authKeys.me(),
    queryFn: fetchCurrentUser,
    enabled: hydrated && Boolean(token),
    staleTime: Infinity,
    retry: false,
  });

  const status: SessionStatus = !hydrated
    ? "loading"
    : !token
      ? "unauthenticated"
      : userQuery.isPending
        ? "loading"
        : userQuery.data
          ? "authenticated"
          : "unauthenticated";

  const logout = useCallback(() => {
    dispatch(signedOut());
    dispatch(chatReset());
    queryClient.clear();
  }, [dispatch, queryClient]);

  return { status, token, user: userQuery.data ?? null, logout };
}
