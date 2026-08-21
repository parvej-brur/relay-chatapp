"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/SearchInput";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/AuthProvider";
import { useUserSearch } from "../hooks/useUserSearch";
import { UserRow } from "./UserRow";
import { UserSearchResults } from "./UserSearchResults";

type DirectMessageTabProps = {
  onStart: (userId: string) => Promise<void>;
};

export function DirectMessageTab({ onStart }: DirectMessageTabProps) {
  const { token, user } = useAuth();
  const [query, setQuery] = useState("");
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const search = useUserSearch(token, query);

  const results = search.results.filter((result) => result._id !== user?._id);

  const handleSelect = async (userId: string) => {
    setPendingUserId(userId);
    setError(null);
    try {
      await onStart(userId);
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Could not start that conversation.");
      setPendingUserId(null);
    }
  };

  return (
    <div className="flex min-h-0 flex-col">
      <div className="shrink-0 px-6 pt-4 pb-3">
        <SearchInput
          autoFocus
          placeholder="Search by name or phone number"
          className="h-11"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        {error ? (
          <p role="alert" className="mt-2 text-xs font-medium text-danger">
            {error}
          </p>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        <UserSearchResults
          status={search.status}
          error={search.error}
          results={results}
          query={query}
          idleHint="Search for someone by name or phone number to start chatting."
          renderRow={(result) => (
            <UserRow
              key={result._id}
              user={result}
              subtitle={result.phone}
              disabled={pendingUserId !== null}
              onClick={() => void handleSelect(result._id)}
              trailing={pendingUserId === result._id ? <Spinner className="text-brand" /> : undefined}
            />
          )}
        />
      </div>
    </div>
  );
}
