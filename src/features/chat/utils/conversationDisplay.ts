import type { User } from "@/types/user";
import type { Conversation, GroupConversation } from "../types";

export function isGroup(conversation: Conversation): conversation is GroupConversation {
  return conversation.type === "group";
}

export function getConversationTitle(conversation: Conversation): string {
  return isGroup(conversation) ? conversation.name : conversation.participant.name;
}

export function getConversationMembers(conversation: Conversation): User[] {
  return isGroup(conversation) ? conversation.participants : [conversation.participant];
}

export function findSender(conversation: Conversation, senderId: string): User | undefined {
  return getConversationMembers(conversation).find((member) => member._id === senderId);
}

export function getGroupSubtitle(group: GroupConversation, currentUserId: string): string {
  const names = group.participants.map((member) =>
    member._id === currentUserId ? "You" : member.name.split(" ")[0],
  );
  return `${group.participants.length} members · ${names.join(", ")}`;
}

export function getLastMessagePreview(conversation: Conversation, currentUserId: string): string {
  const lastMessage = conversation.lastMessage;
  if (!lastMessage?.text?.trim()) return "No messages yet";

  if (lastMessage.sender === currentUserId) return `You: ${lastMessage.text}`;
  if (!isGroup(conversation)) return lastMessage.text;

  const sender = findSender(conversation, lastMessage.sender ?? "");
  return sender ? `${sender.name.split(" ")[0]}: ${lastMessage.text}` : lastMessage.text;
}

export function getConversationTimestamp(conversation: Conversation): string | undefined {
  return conversation.lastMessage?.createdAt ?? conversation.updatedAt ?? conversation.createdAt;
}

export function sortByRecency(conversations: Conversation[]): Conversation[] {
  return [...conversations].sort((a, b) => {
    const left = new Date(getConversationTimestamp(a) ?? 0).getTime();
    const right = new Date(getConversationTimestamp(b) ?? 0).getTime();
    return right - left;
  });
}

export function matchesConversationQuery(conversation: Conversation, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;

  if (getConversationTitle(conversation).toLowerCase().includes(needle)) return true;
  return getConversationMembers(conversation).some(
    (member) =>
      member.name.toLowerCase().includes(needle) || member.phone.replace(/\s/g, "").includes(needle),
  );
}
