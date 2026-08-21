"use client";

import { useCallback, useMemo, useState } from "react";
import { useAuth } from "@/providers/AuthProvider";
import {
  createDirectConversation,
  createGroupConversation,
  fetchConversations,
  sendMessage,
} from "../api/chat.api";
import type { Conversation, Message } from "../types";
import { sortByRecency } from "../utils/conversationDisplay";
import { useChatSocket } from "./useChatSocket";
import { useConversations } from "./useConversations";
import { useMessages } from "./useMessages";

function withLastMessage(conversation: Conversation, message: Message): Conversation {
  return {
    ...conversation,
    lastMessage: { text: message.text, sender: message.sender, createdAt: message.createdAt },
    updatedAt: message.createdAt,
  };
}

export function useChat() {
  const { token, user } = useAuth();
  const currentUserId = user?._id ?? "";

  const { conversations, status, error, reload, setConversations } = useConversations(token);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const messages = useMessages(token, activeId);

  const applyMessageToList = useCallback(
    (message: Message) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation._id === message.conversation ? withLastMessage(conversation, message) : conversation,
        ),
      );
    },
    [setConversations],
  );

  const handleIncomingMessage = useCallback(
    (message: Message) => {
      const isKnown = conversations.some(
        (conversation) => conversation._id === message.conversation,
      );
      if (!isKnown) reload();
      applyMessageToList(message);

      if (message.conversation === activeId) {
        messages.appendMessage(message);
        return;
      }
      setUnreadCounts((current) => ({
        ...current,
        [message.conversation]: (current[message.conversation] ?? 0) + 1,
      }));
    },
    [activeId, conversations, applyMessageToList, messages, reload],
  );

  const handleConversationUpdated = useCallback(
    (updated: Conversation) => {
      setConversations((current) => {
        const index = current.findIndex((conversation) => conversation._id === updated._id);
        if (index === -1) {
          reload();
          return current;
        }
        const next = [...current];
        // The socket payload omits lastMessage/updatedAt, so merge instead of replacing.
        next[index] = { ...current[index], ...updated } as Conversation;
        return next;
      });
    },
    [reload, setConversations],
  );

  const { connected } = useChatSocket(token, {
    onMessage: handleIncomingMessage,
    onConversationUpdated: handleConversationUpdated,
  });

  const selectConversation = useCallback((conversationId: string | null) => {
    setActiveId(conversationId);
    if (!conversationId) return;
    setUnreadCounts((current) => {
      if (!current[conversationId]) return current;
      const { [conversationId]: _cleared, ...rest } = current;
      return rest;
    });
  }, []);

  const sendText = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!token || !activeId || trimmed.length === 0) return;

      const message = await sendMessage(token, { conversationId: activeId, text: trimmed });
      messages.appendMessage(message);
      applyMessageToList(message);
    },
    [token, activeId, messages, applyMessageToList],
  );

  const startDirectConversation = useCallback(
    async (userId: string) => {
      if (!token) return;
      const created = await createDirectConversation(token, userId);
      // The create response is not displayable on its own, so refresh the list before selecting.
      setConversations(await fetchConversations(token));
      selectConversation(created._id);
    },
    [token, setConversations, selectConversation],
  );

  const startGroupConversation = useCallback(
    async (name: string, participantIds: string[]) => {
      if (!token) return;
      const group = await createGroupConversation(token, { name, participantIds });
      setConversations((current) => [group, ...current.filter((item) => item._id !== group._id)]);
      selectConversation(group._id);
    },
    [token, setConversations, selectConversation],
  );

  const orderedConversations = useMemo(() => sortByRecency(conversations), [conversations]);
  const activeConversation = orderedConversations.find((item) => item._id === activeId) ?? null;

  return {
    currentUserId,
    conversations: orderedConversations,
    conversationsStatus: status,
    conversationsError: error,
    reloadConversations: reload,
    setConversations,
    activeConversation,
    selectConversation,
    unreadCounts,
    messages,
    sendText,
    startDirectConversation,
    startGroupConversation,
    socketConnected: connected,
  };
}
