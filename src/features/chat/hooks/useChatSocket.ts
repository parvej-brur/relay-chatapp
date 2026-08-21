"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { env } from "@/config/env";
import type { Conversation, Message } from "../types";
import { normalizeMessage } from "../utils/normalizeMessage";

type ChatSocketHandlers = {
  onMessage: (message: Message) => void;
  onConversationUpdated: (conversation: Conversation) => void;
};

export function useChatSocket(token: string | null, handlers: ChatSocketHandlers) {
  const [connected, setConnected] = useState(false);
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    if (!token) return;

    const socket = io(env.socketUrl, { auth: { token }, transports: ["websocket", "polling"] });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));
    socket.on("message:new", (raw) => handlersRef.current.onMessage(normalizeMessage(raw)));
    socket.on("conversation:updated", (conversation: Conversation) =>
      handlersRef.current.onConversationUpdated(conversation),
    );

    return () => {
      socket.disconnect();
    };
  }, [token]);

  return { connected };
}
