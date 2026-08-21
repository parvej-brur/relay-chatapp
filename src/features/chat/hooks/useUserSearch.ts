"use client";

import { useEffect, useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApiError } from "@/lib/api/client";
import type { User } from "@/types/user";
import { searchUsers } from "../api/chat.api";
import type { RequestStatus } from "../types";

export function useUserSearch(token: string | null, query: string) {
  const debouncedQuery = useDebouncedValue(query.trim(), 300);
  const [results, setResults] = useState<User[]>([]);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const run = async () => {
      if (!token || debouncedQuery.length === 0) {
        setResults([]);
        setStatus("idle");
        return;
      }

      setStatus("loading");
      setError(null);
      try {
        const users = await searchUsers(token, debouncedQuery, controller.signal);
        setResults(users);
        setStatus("success");
      } catch (caught) {
        if (controller.signal.aborted) return;
        setError(caught instanceof ApiError ? caught.message : "Search failed.");
        setStatus("error");
      }
    };

    void run();

    return () => controller.abort();
  }, [token, debouncedQuery]);

  return { results, status, error };
}
