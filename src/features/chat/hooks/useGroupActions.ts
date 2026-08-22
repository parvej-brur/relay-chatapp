"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toErrorMessage } from "@/lib/api/client";
import { useSession } from "@/hooks/useSession";
import { useAppDispatch } from "@/store/hooks";
import { conversationOpened } from "@/store/chatSlice";
import { addParticipants, promoteToAdmin, removeParticipant, renameGroup } from "../api/chat.api";
import type { GroupConversation } from "../types";
import { cacheConversationPatch, dropConversation } from "../utils/chatCache";

export type GroupActionKey = "rename" | "add" | "remove" | "promote" | "leave";

type MutationState = { isPending: boolean; error: Error | null };

// Every admin action answers with the updated group, so they all settle the same way:
// merge the response into the cached conversation list.
function useGroupMutation<Variables>(
  mutationFn: (variables: Variables) => Promise<GroupConversation | null>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (group) => {
      if (group) cacheConversationPatch(queryClient, group);
    },
  });
}

export function useGroupActions() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  const { user } = useSession();

  const rename = useGroupMutation(({ id, name }: { id: string; name: string }) =>
    renameGroup(id, name),
  );
  const add = useGroupMutation(({ id, userIds }: { id: string; userIds: string[] }) =>
    addParticipants(id, userIds),
  );
  const remove = useGroupMutation(({ id, userId }: { id: string; userId: string }) =>
    removeParticipant(id, userId),
  );
  const promote = useGroupMutation(({ id, userId }: { id: string; userId: string }) =>
    promoteToAdmin(id, userId),
  );

  const leave = useMutation({
    mutationFn: (id: string) => removeParticipant(id, user?._id ?? ""),
    onSuccess: (_result, id) => {
      dropConversation(queryClient, id);
      dispatch(conversationOpened(null));
    },
  });

  // Only the shared surface is needed here, so the five differently-typed mutations can
  // be read as one list to derive a single pending key and a single error message.
  const running: Array<[GroupActionKey, MutationState]> = [
    ["rename", rename],
    ["add", add],
    ["remove", remove],
    ["promote", promote],
    ["leave", leave],
  ];

  const failed = running.find(([, mutation]) => mutation.error)?.[1].error;

  return {
    pending: running.find(([, mutation]) => mutation.isPending)?.[0] ?? null,
    error: failed ? toErrorMessage(failed, "That action could not be completed.") : null,
    rename: (id: string, name: string) => rename.mutate({ id, name }),
    addMembers: (id: string, userIds: string[]) => add.mutate({ id, userIds }),
    removeMember: (id: string, userId: string) => remove.mutate({ id, userId }),
    promote: (id: string, userId: string) => promote.mutate({ id, userId }),
    leave: (id: string) => leave.mutate(id),
  };
}
