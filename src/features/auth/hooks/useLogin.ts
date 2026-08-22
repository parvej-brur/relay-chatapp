"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys, login, type LoginRequest } from "@/lib/auth/auth.api";
import { useAppDispatch } from "@/store/hooks";
import { signedIn } from "@/store/sessionSlice";

export function useLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: LoginRequest) => login(body),
    onSuccess: (session) => {
      dispatch(signedIn(session.token));
      // The login response already carries the user, so seed the cache instead of
      // making every screen wait on a second /auth/me round trip.
      queryClient.setQueryData(authKeys.me(), session.user);
    },
  });
}
