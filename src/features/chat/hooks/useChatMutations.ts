"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/store/hooks";
import { conversationOpened } from "@/store/chatSlice";
import {
  chatKeys,
  createDirectConversation,
  createGroupConversation,
  sendMessage,
} from "../api/chat.api";
import type { Conversation } from "../types";
import { cacheLastMessage, cacheMessage } from "../utils/chatCache";

export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessage,
    // The server does not echo message:new back to the sender, so the REST response is
    // what puts the sent message on screen.
    onSuccess: (message) => {
      cacheMessage(queryClient, message);
      cacheLastMessage(queryClient, message);
    },
  });
}

export function useStartDirectConversation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: async (userId: string) => {
      const created = await createDirectConversation(userId);
      await queryClient.refetchQueries({ queryKey: chatKeys.conversations() });
      return created._id;
    },
    onSuccess: (conversationId) => dispatch(conversationOpened(conversationId)),
  });
}

export function useCreateGroupConversation() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: createGroupConversation,
    onSuccess: (group) => {
      queryClient.setQueryData<Conversation[]>(
        chatKeys.conversations(),
        (current) => [
          group,
          ...(current ?? []).filter(
            (conversation) => conversation._id !== group._id,
          ),
        ],
      );
      dispatch(conversationOpened(group._id));
    },
  });
}
