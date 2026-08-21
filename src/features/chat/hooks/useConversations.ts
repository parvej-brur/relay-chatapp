"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { fetchConversations } from "../api/chat.api";
import type { Conversation, RequestStatus } from "../types";

export function useConversations(token: string | null) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    if (!token) return;
    let active = true;

    const load = async () => {
      setStatus((current) => (current === "success" ? current : "loading"));
      try {
        const data = await fetchConversations(token);
        if (!active) return;
        setConversations(data);
        setError(null);
        setStatus("success");
      } catch (caught) {
        if (!active) return;
        setError(caught instanceof ApiError ? caught.message : "Unable to load conversations.");
        setStatus("error");
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [token, reloadCount]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  return { conversations, status, error, reload, setConversations };
}
