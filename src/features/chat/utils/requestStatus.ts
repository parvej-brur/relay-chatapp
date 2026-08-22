import type { RequestStatus } from "../types";

// Keeps the presentational components free of any React Query types: they only ever
// receive the four-state union the design already handles.
export function toRequestStatus(query: {
  isPending: boolean;
  isError: boolean;
  fetchStatus?: "fetching" | "paused" | "idle";
}): RequestStatus {
  if (query.isError) return "error";
  if (query.isPending) return query.fetchStatus === "idle" ? "idle" : "loading";
  return "success";
}
