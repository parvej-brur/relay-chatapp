"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ApiError, toErrorMessage } from "@/lib/api/client";
import { chatKeys, searchUsers } from "../api/chat.api";
import { toRequestStatus } from "../utils/requestStatus";

// The search term is interpolated straight into a server-side regex, so a phone number
// typed with its "+" prefix makes the query itself invalid and the request 500s. Nothing
// the client sends can satisfy both that regex and the exact-match the phone field uses,
// so the failure is translated into something the user can act on.
const INVALID_REGEX_CODE = 51091;

function describeSearchError(error: unknown): string {
  if (error instanceof ApiError && error.code === INVALID_REGEX_CODE) {
    return "That search could not be run. Try a name, or a phone number without the + prefix.";
  }
  return toErrorMessage(error, "Search failed.");
}

export function useUserSearch(query: string) {
  const term = useDebouncedValue(query.trim(), 300);

  const search = useQuery({
    queryKey: chatKeys.userSearch(term),
    queryFn: ({ signal }) => searchUsers(term, signal),
    enabled: term.length > 0,
    staleTime: 60_000,
    // Keeps the previous matches on screen while the next keystroke resolves, so the
    // list refines instead of blanking out on every character.
    placeholderData: keepPreviousData,
    // A rejected term stays rejected, and the default retry would fire two more requests
    // per keystroke against a 500 the server will keep returning.
    retry: false,
  });

  return {
    results: search.data ?? [],
    status: term.length === 0 ? ("idle" as const) : toRequestStatus(search),
    error: search.error ? describeSearchError(search.error) : null,
  };
}
