import { apiRequest } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { User } from "@/types/user";
import type { Conversation, GroupConversation, Message, MessagePage } from "../types";

export const MESSAGE_PAGE_SIZE = 30;

export const chatKeys = {
  all: ["chat"] as const,
  conversations: () => [...chatKeys.all, "conversations"] as const,
  messages: (conversationId: string) => [...chatKeys.all, "messages", conversationId] as const,
  userSearch: (query: string) => [...chatKeys.all, "user-search", query] as const,
};

export type CreateGroupRequest = {
  name: string;
  participantIds: string[];
};

export type SendMessageRequest = {
  conversationId: string;
  text: string;
};

export async function fetchConversations(): Promise<Conversation[]> {
  const response = await apiRequest<{ data: Conversation[] } | Conversation[]>(
    ENDPOINTS.conversations,
  );
  return Array.isArray(response) ? response : (response?.data ?? []);
}

// Creating a direct chat answers a bare { _id, participants: string[] }, so the caller
// has to reload the list to get the displayable conversation.
export function createDirectConversation(userId: string) {
  return apiRequest<{ _id: string }>(ENDPOINTS.conversations, { method: "POST", body: { userId } });
}

export function createGroupConversation(body: CreateGroupRequest) {
  return apiRequest<GroupConversation>(ENDPOINTS.group, { method: "POST", body });
}

export function fetchMessages(
  conversationId: string,
  options: { before?: string; signal?: AbortSignal } = {},
) {
  return apiRequest<MessagePage>(ENDPOINTS.conversationMessages(conversationId), {
    signal: options.signal,
    query: { limit: MESSAGE_PAGE_SIZE, before: options.before },
  });
}

export function sendMessage(body: SendMessageRequest) {
  return apiRequest<Message>(ENDPOINTS.messages, { method: "POST", body });
}

export function searchUsers(query: string, signal?: AbortSignal) {
  return apiRequest<User[]>(ENDPOINTS.searchUsers, { signal, query: { q: query } });
}

export function renameGroup(conversationId: string, name: string) {
  return apiRequest<GroupConversation>(ENDPOINTS.conversation(conversationId), {
    method: "PATCH",
    body: { name },
  });
}

export function addParticipants(conversationId: string, userIds: string[]) {
  return apiRequest<GroupConversation>(ENDPOINTS.participants(conversationId), {
    method: "POST",
    body: { userIds },
  });
}

export function removeParticipant(conversationId: string, userId: string) {
  return apiRequest<GroupConversation | null>(ENDPOINTS.participant(conversationId, userId), {
    method: "DELETE",
  });
}

export function promoteToAdmin(conversationId: string, userId: string) {
  return apiRequest<GroupConversation>(ENDPOINTS.admins(conversationId), {
    method: "POST",
    body: { userId },
  });
}
