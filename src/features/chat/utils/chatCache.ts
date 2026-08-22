import type { InfiniteData, QueryClient } from "@tanstack/react-query";
import { chatKeys } from "../api/chat.api";
import type { Conversation, Message, MessagePage } from "../types";

type MessagesData = InfiniteData<MessagePage, string | undefined>;

export function readConversations(queryClient: QueryClient): Conversation[] {
  return queryClient.getQueryData<Conversation[]>(chatKeys.conversations()) ?? [];
}

// A message that arrives while its conversation is open goes straight into the cache;
// the server never echoes it back, and refetching the page would be wasteful anyway.
export function cacheMessage(queryClient: QueryClient, message: Message): void {
  queryClient.setQueryData<MessagesData>(chatKeys.messages(message.conversation), (current) => {
    if (!current || current.pages.length === 0) return current;

    const [newest, ...older] = current.pages;
    if (newest.messages.some((existing) => existing._id === message._id)) return current;

    // History comes back newest-first, so the newest message belongs at the head of page 0.
    return {
      ...current,
      pages: [{ ...newest, messages: [message, ...newest.messages] }, ...older],
    };
  });
}

export function cacheLastMessage(queryClient: QueryClient, message: Message): void {
  queryClient.setQueryData<Conversation[]>(chatKeys.conversations(), (current) =>
    current?.map((conversation) =>
      conversation._id === message.conversation
        ? {
            ...conversation,
            lastMessage: {
              text: message.text,
              sender: message.sender,
              createdAt: message.createdAt,
            },
            updatedAt: message.createdAt,
          }
        : conversation,
    ),
  );
}

// The conversation:updated payload omits lastMessage and updatedAt, so it is merged into
// the record already held rather than replacing it.
export function cacheConversationPatch(queryClient: QueryClient, updated: Conversation): void {
  queryClient.setQueryData<Conversation[]>(chatKeys.conversations(), (current) =>
    current?.map((conversation) =>
      conversation._id === updated._id
        ? ({ ...conversation, ...updated } as Conversation)
        : conversation,
    ),
  );
}

export function dropConversation(queryClient: QueryClient, conversationId: string): void {
  queryClient.setQueryData<Conversation[]>(chatKeys.conversations(), (current) =>
    current?.filter((conversation) => conversation._id !== conversationId),
  );
  queryClient.removeQueries({ queryKey: chatKeys.messages(conversationId) });
}
