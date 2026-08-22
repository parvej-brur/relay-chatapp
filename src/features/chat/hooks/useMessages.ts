"use client";

import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { toErrorMessage } from "@/lib/api/client";
import { chatKeys, fetchMessages } from "../api/chat.api";
import type { Message, MessagePage } from "../types";
import { toRequestStatus } from "../utils/requestStatus";

// History arrives newest-first, page by page, and the `before` cursor is inclusive — so
// the anchor message repeats on every page. One pass walks the pages backwards into
// display order, drops the repeats, and skips the blank messages the server accepts.
function toDisplayOrder(data: InfiniteData<MessagePage, string | undefined>): Message[] {
  const seen = new Set<string>();
  const ordered: Message[] = [];

  for (let page = data.pages.length - 1; page >= 0; page -= 1) {
    const { messages } = data.pages[page];
    for (let index = messages.length - 1; index >= 0; index -= 1) {
      const message = messages[index];
      if (seen.has(message._id) || message.text.trim().length === 0) continue;
      seen.add(message._id);
      ordered.push(message);
    }
  }

  return ordered;
}

export function useMessages(conversationId: string | null) {
  const query = useInfiniteQuery({
    queryKey: chatKeys.messages(conversationId ?? ""),
    queryFn: ({ pageParam, signal }) =>
      fetchMessages(conversationId as string, { before: pageParam, signal }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore && lastPage.messages.length > 0
        ? lastPage.messages[lastPage.messages.length - 1]._id
        : undefined,
    enabled: Boolean(conversationId),
    select: toDisplayOrder,
  });

  return {
    messages: query.data ?? [],
    status: toRequestStatus(query),
    error: query.error ? toErrorMessage(query.error, "Unable to load messages.") : null,
    hasMore: query.hasNextPage,
    loadingOlder: query.isFetchingNextPage,
    loadOlder: query.fetchNextPage,
    reload: query.refetch,
  };
}
