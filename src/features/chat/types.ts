import type { User } from "@/types/user";

export type LastMessagePreview = {
  text?: string;
  sender?: string;
  createdAt?: string;
};

type ConversationBase = {
  _id: string;
  lastMessage?: LastMessagePreview;
  updatedAt?: string;
  createdAt?: string;
};

export type DirectConversation = ConversationBase & {
  type: "direct";
  participant: User;
};

export type GroupConversation = ConversationBase & {
  type: "group";
  name: string;
  createdBy: string;
  admins: string[];
  participants: User[];
};

export type Conversation = DirectConversation | GroupConversation;

export type Message = {
  _id: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string;
};

export type MessagePage = {
  messages: Message[];
  hasMore: boolean;
};

export type RequestStatus = "idle" | "loading" | "success" | "error";
