import { FiUsers } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import { formatConversationTime } from "@/lib/utils/date";
import type { Conversation } from "../types";
import {
  getConversationTimestamp,
  getConversationTitle,
  getLastMessagePreview,
  isGroup,
} from "../utils/conversationDisplay";

type ConversationListItemProps = {
  conversation: Conversation;
  currentUserId: string;
  active: boolean;
  unreadCount: number;
  onSelect: (conversationId: string) => void;
};

export function ConversationListItem({
  conversation,
  currentUserId,
  active,
  unreadCount,
  onSelect,
}: ConversationListItemProps) {
  const title = getConversationTitle(conversation);
  const timestamp = getConversationTimestamp(conversation);
  const highlight = active || unreadCount > 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(conversation._id)}
      aria-current={active ? "true" : undefined}
      className={cn(
        "flex w-full items-center gap-3 border-l-[3px] px-4 py-3 text-left transition-colors",
        active ? "border-brand bg-brand-soft" : "border-transparent hover:bg-surface",
      )}
    >
      <Avatar name={title} seed={conversation._id} />
      <span className="min-w-0 flex-1">
        <span className="mb-0.5 flex items-baseline justify-between gap-2">
          <span className="flex min-w-0 items-center gap-1">
            <span className="truncate text-sm font-semibold text-ink">{title}</span>
            {isGroup(conversation) ? (
              <FiUsers size={12} className="shrink-0 text-subtle" aria-hidden="true" />
            ) : null}
          </span>
          {timestamp ? (
            <span
              className={cn(
                "shrink-0 text-[11px]",
                highlight ? "font-semibold text-brand" : "text-subtle",
              )}
            >
              {formatConversationTime(timestamp)}
            </span>
          ) : null}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="flex-1 truncate text-xs text-muted">
            {getLastMessagePreview(conversation, currentUserId)}
          </span>
          {unreadCount > 0 ? (
            <span className="flex h-[18px] min-w-[18px] shrink-0 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </span>
      </span>
    </button>
  );
}
