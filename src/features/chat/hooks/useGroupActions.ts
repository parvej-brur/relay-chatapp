"use client";

import { type Dispatch, type SetStateAction, useCallback, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/providers/AuthProvider";
import { addParticipants, promoteToAdmin, removeParticipant, renameGroup } from "../api/chat.api";
import type { Conversation, GroupConversation } from "../types";

type GroupActionKey = "rename" | "add" | "remove" | "promote" | "leave";

export function useGroupActions(
  setConversations: Dispatch<SetStateAction<Conversation[]>>,
  onLeftGroup: (conversationId: string) => void,
) {
  const { token, user } = useAuth();
  const [pending, setPending] = useState<GroupActionKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const replaceGroup = useCallback(
    (group: GroupConversation) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation._id === group._id ? { ...conversation, ...group } : conversation,
        ),
      );
    },
    [setConversations],
  );

  const run = useCallback(
    async (key: GroupActionKey, action: () => Promise<GroupConversation | null>) => {
      if (!token) return;
      setPending(key);
      setError(null);
      try {
        const group = await action();
        if (group) replaceGroup(group);
      } catch (caught) {
        setError(caught instanceof ApiError ? caught.message : "That action could not be completed.");
      } finally {
        setPending(null);
      }
    },
    [token, replaceGroup],
  );

  return {
    pending,
    error,
    clearError: useCallback(() => setError(null), []),
    rename: useCallback(
      (id: string, name: string) => run("rename", () => renameGroup(token!, id, name)),
      [run, token],
    ),
    addMembers: useCallback(
      (id: string, userIds: string[]) => run("add", () => addParticipants(token!, id, userIds)),
      [run, token],
    ),
    removeMember: useCallback(
      (id: string, userId: string) => run("remove", () => removeParticipant(token!, id, userId)),
      [run, token],
    ),
    promote: useCallback(
      (id: string, userId: string) => run("promote", () => promoteToAdmin(token!, id, userId)),
      [run, token],
    ),
    leave: useCallback(
      (id: string) =>
        run("leave", async () => {
          await removeParticipant(token!, id, user!._id);
          setConversations((current) => current.filter((conversation) => conversation._id !== id));
          onLeftGroup(id);
          return null;
        }),
      [run, token, user, setConversations, onLeftGroup],
    ),
  };
}
