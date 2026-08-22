"use client";

import { useCallback } from "react";
import { useSession } from "@/hooks/useSession";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { conversationOpened } from "@/store/chatSlice";
import {
  useCreateGroupConversation,
  useSendMessage,
  useStartDirectConversation,
} from "./useChatMutations";
import { useChatSocket } from "./useChatSocket";
import { useConversations } from "./useConversations";
import { useMessages } from "./useMessages";

// The single container for the chat screen: it wires the queries, the mutations, the
// socket and the client-side UI state together and hands ChatScreen a flat API.
export function useChat() {
  const { user } = useSession();
  const dispatch = useAppDispatch();

  const activeConversationId = useAppSelector((state) => state.chat.activeConversationId);
  const unreadCounts = useAppSelector((state) => state.chat.unreadCounts);
  const socketConnected = useAppSelector((state) => state.chat.socketConnected);

  const { conversations, status, error, reload } = useConversations();
  const messages = useMessages(activeConversationId);
  useChatSocket();

  const sendMessage = useSendMessage();
  const startDirect = useStartDirectConversation();
  const createGroup = useCreateGroupConversation();

  const activeConversation =
    conversations.find((conversation) => conversation._id === activeConversationId) ?? null;

  return {
    currentUserId: user?._id ?? "",
    conversations,
    conversationsStatus: status,
    conversationsError: error,
    reloadConversations: reload,
    activeConversation,
    selectConversation: useCallback(
      (conversationId: string | null) => dispatch(conversationOpened(conversationId)),
      [dispatch],
    ),
    unreadCounts,
    messages,
    socketConnected,
    sendText: useCallback(
      async (text: string) => {
        if (!activeConversationId) return;
        await sendMessage.mutateAsync({ conversationId: activeConversationId, text: text.trim() });
      },
      [sendMessage, activeConversationId],
    ),
    startDirectConversation: useCallback(
      async (userId: string) => {
        await startDirect.mutateAsync(userId);
      },
      [startDirect],
    ),
    startGroupConversation: useCallback(
      async (name: string, participantIds: string[]) => {
        await createGroup.mutateAsync({ name, participantIds });
      },
      [createGroup],
    ),
  };
}
