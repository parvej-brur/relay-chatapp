"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchMessages } from "../api/chat.api";
import type { Message, RequestStatus } from "../types";

// The API returns newest-first and accepts blank text, so flip the order and drop
// messages that would render as an empty bubble.
function toDisplayOrder(messages: Message[]): Message[] {
  return [...messages].reverse().filter((message) => message.text.trim().length > 0);
}

export function useMessages(token: string | null, conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      if (!token || !conversationId) {
        setMessages([]);
        setStatus("idle");
        return;
      }

      setStatus("loading");
      setError(null);
      try {
        const page = await fetchMessages(token, conversationId, { signal: controller.signal });
        setMessages(toDisplayOrder(page.messages));
        setHasMore(Boolean(page.hasMore));
        setStatus("success");
      } catch (caught) {
        if (controller.signal.aborted) return;
        setError(caught instanceof ApiError ? caught.message : "Unable to load messages.");
        setStatus("error");
      }
    };

    void load();

    return () => controller.abort();
  }, [token, conversationId, reloadCount]);

  const loadOlder = useCallback(async () => {
    if (!token || !conversationId || loadingOlder || !hasMore || messages.length === 0) return;

    setLoadingOlder(true);
    try {
      const page = await fetchMessages(token, conversationId, { before: messages[0]._id });
      // The `before` cursor is inclusive, so the anchor message comes back on every page.
      setMessages((current) => {
        const known = new Set(current.map((message) => message._id));
        const older = toDisplayOrder(page.messages).filter((message) => !known.has(message._id));
        return [...older, ...current];
      });
      setHasMore(Boolean(page.hasMore));
    } catch {
      setHasMore(false);
    } finally {
      setLoadingOlder(false);
    }
  }, [token, conversationId, loadingOlder, hasMore, messages]);

  const appendMessage = useCallback((message: Message) => {
    setMessages((current) =>
      current.some((existing) => existing._id === message._id) ? current : [...current, message],
    );
  }, []);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return { messages, status, error, hasMore, loadingOlder, loadOlder, appendMessage, reload };
}
