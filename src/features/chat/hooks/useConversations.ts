"use client";

import { useQuery } from "@tanstack/react-query";
import { toErrorMessage } from "@/lib/api/client";
import { chatKeys, fetchConversations } from "../api/chat.api";
import { sortByRecency } from "../utils/conversationDisplay";
import { toRequestStatus } from "../utils/requestStatus";

export function useConversations() {
  const query = useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: fetchConversations,
    // The list has no server-side ordering, so the newest conversation is put on top here.
    select: sortByRecency,
  });

  return {
    conversations: query.data ?? [],
    status: toRequestStatus(query),
    error: query.error ? toErrorMessage(query.error, "Unable to load conversations.") : null,
    reload: query.refetch,
  };
}
