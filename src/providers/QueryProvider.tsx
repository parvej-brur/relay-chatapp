"use client";

import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ApiError } from "@/lib/api/client";
import { useAppDispatch } from "@/store/hooks";
import { signedOut } from "@/store/sessionSlice";

function isClientError(error: unknown): boolean {
  return error instanceof ApiError && error.status >= 400 && error.status < 500;
}

function createQueryClient(onUnauthorized: (client: QueryClient) => void): QueryClient {
  const handleError = (error: unknown) => {
    if (error instanceof ApiError && error.status === 401) onUnauthorized(client);
  };

  const client = new QueryClient({
    queryCache: new QueryCache({ onError: handleError }),
    mutationCache: new MutationCache({ onError: handleError }),
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        refetchOnWindowFocus: false,
        // Retrying a 4xx just repeats a request the server already rejected.
        retry: (failureCount, error) => !isClientError(error) && failureCount < 2,
      },
      mutations: { retry: false },
    },
  });

  return client;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  // An expired token is not something any single screen can recover from, so it is handled
  // once here: drop the session and let the route gate send the user back to /login.
  const [queryClient] = useState(() =>
    createQueryClient((client) => {
      client.clear();
      dispatch(signedOut());
    }),
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
