export const ENDPOINTS = {
  login: "/auth/login",
  me: "/auth/me",
  searchUsers: "/users/search",
  conversations: "/conversations",
  group: "/conversations/group",
  messages: "/messages",
  conversation: (id: string) => `/conversations/${id}`,
  conversationMessages: (id: string) => `/conversations/${id}/messages`,
  participants: (id: string) => `/conversations/${id}/participants`,
  participant: (id: string, userId: string) => `/conversations/${id}/participants/${userId}`,
  admins: (id: string) => `/conversations/${id}/admins`,
} as const;
