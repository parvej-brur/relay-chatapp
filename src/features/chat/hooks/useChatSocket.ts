"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { env } from "@/config/env";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { messageMissed, socketStatusChanged } from "@/store/chatSlice";
import { chatKeys } from "../api/chat.api";
import type { Conversation } from "../types";
import {
  cacheConversationPatch,
  cacheLastMessage,
  cacheMessage,
  readConversations,
} from "../utils/chatCache";
import { normalizeMessage } from "../utils/normalizeMessage";

// One socket per session.
export function useChatSocket() {
  const token = useAppSelector((state) => state.session.token);
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId,
  );
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  const handlersRef = useRef({ activeConversationId, dispatch, queryClient });
  useEffect(() => {
    handlersRef.current = { activeConversationId, dispatch, queryClient };
  });

  useEffect(() => {
    if (!token) return;

    const socket = io(env.socketUrl, {
      auth: { token },
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => dispatch(socketStatusChanged(true)));
    socket.on("disconnect", () => dispatch(socketStatusChanged(false)));
    socket.on("connect_error", () => dispatch(socketStatusChanged(false)));

    socket.on("message:new", (raw) => {
      const current = handlersRef.current;
      const message = normalizeMessage(raw);
      const known = readConversations(current.queryClient).some(
        (conversation) => conversation._id === message.conversation,
      );

      // A message from a conversation this client has never seen means someone just
      // started a chat with us, so the list has to come down again.
      if (!known) {
        void current.queryClient.invalidateQueries({
          queryKey: chatKeys.conversations(),
        });
      } else {
        cacheLastMessage(current.queryClient, message);
      }

      cacheMessage(current.queryClient, message);
      if (message.conversation !== current.activeConversationId) {
        current.dispatch(messageMissed(message.conversation));
      }
    });

    socket.on("conversation:updated", (conversation: Conversation) => {
      const current = handlersRef.current;
      const known = readConversations(current.queryClient).some(
        (existing) => existing._id === conversation._id,
      );

      if (known) cacheConversationPatch(current.queryClient, conversation);
      else
        void current.queryClient.invalidateQueries({
          queryKey: chatKeys.conversations(),
        });
    });

    return () => {
      socket.disconnect();
      dispatch(socketStatusChanged(false));
    };
  }, [token, dispatch]);
}
