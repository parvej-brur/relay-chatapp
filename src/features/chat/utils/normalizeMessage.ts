import type { Message } from "../types";

// Socket payloads carry `id` and an epoch-millisecond `createdAt`; REST returns `_id`
// and an ISO string. Everything downstream works with the REST shape.
type RawMessage = {
  _id?: string;
  id?: string;
  conversation: string;
  sender: string;
  text: string;
  createdAt: string | number;
};

export function normalizeMessage(raw: RawMessage): Message {
  return {
    _id: raw._id ?? raw.id ?? "",
    conversation: raw.conversation,
    sender: raw.sender,
    text: raw.text,
    createdAt: typeof raw.createdAt === "number" ? new Date(raw.createdAt).toISOString() : raw.createdAt,
  };
}
