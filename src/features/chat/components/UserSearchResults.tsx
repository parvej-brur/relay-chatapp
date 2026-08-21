import type { ReactNode } from "react";
import { Spinner } from "@/components/ui/Spinner";
import type { User } from "@/types/user";
import type { RequestStatus } from "../types";

type UserSearchResultsProps = {
  status: RequestStatus;
  error: string | null;
  results: User[];
  query: string;
  idleHint: string;
  renderRow: (user: User) => ReactNode;
};

export function UserSearchResults({
  status,
  error,
  results,
  query,
  idleHint,
  renderRow,
}: UserSearchResultsProps) {
  if (status === "idle") {
    return <p className="px-6 py-6 text-center text-[13px] text-subtle">{idleHint}</p>;
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center py-6 text-subtle">
        <Spinner />
      </div>
    );
  }

  if (status === "error") {
    return (
      <p role="alert" className="px-6 py-6 text-center text-[13px] text-danger">
        {error ?? "Search failed. Try again."}
      </p>
    );
  }

  if (results.length === 0) {
    return (
      <p className="px-6 py-6 text-center text-[13px] text-subtle">
        No people found for “{query.trim()}”.
      </p>
    );
  }

  return (
    <>
      <p className="px-6 pt-1 pb-2 text-[11px] font-semibold tracking-wide text-subtle uppercase">
        Results
      </p>
      {results.map(renderRow)}
    </>
  );
}
