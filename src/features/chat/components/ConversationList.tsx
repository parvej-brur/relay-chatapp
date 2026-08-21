import { FiPlus } from "react-icons/fi";
import { PiChatTeardropDotsFill } from "react-icons/pi";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import type { Conversation, RequestStatus } from "../types";
import { ConversationListItem } from "./ConversationListItem";
import { ConversationListSkeleton } from "./ConversationListSkeleton";

type ConversationListProps = {
  conversations: Conversation[];
  status: RequestStatus;
  error: string | null;
  searchQuery: string;
  currentUserId: string;
  activeConversationId: string | null;
  unreadCounts: Record<string, number>;
  onSelect: (conversationId: string) => void;
  onRetry: () => void;
  onStartConversation: () => void;
};

export function ConversationList({
  conversations,
  status,
  error,
  searchQuery,
  currentUserId,
  activeConversationId,
  unreadCounts,
  onSelect,
  onRetry,
  onStartConversation,
}: ConversationListProps) {
  if (status === "loading" && conversations.length === 0) return <ConversationListSkeleton />;

  if (status === "error" && conversations.length === 0) {
    return (
      <div className="p-4">
        <ErrorState
          title="Unable to load conversations"
          description={error ?? "Please check your connection and try again."}
          onRetry={onRetry}
        />
      </div>
    );
  }

  if (conversations.length === 0) {
    return searchQuery.trim() ? (
      <EmptyState title="No matches" description={`Nothing found for “${searchQuery.trim()}”.`} />
    ) : (
      <EmptyState
        icon={<PiChatTeardropDotsFill size={28} />}
        title="No conversations yet"
        description="Start a chat to begin messaging"
        action={
          <Button size="sm" onClick={onStartConversation}>
            <FiPlus size={14} aria-hidden="true" />
            Start a Chat
          </Button>
        }
      />
    );
  }

  return (
    <div>
      {conversations.map((conversation) => (
        <ConversationListItem
          key={conversation._id}
          conversation={conversation}
          currentUserId={currentUserId}
          active={conversation._id === activeConversationId}
          unreadCount={unreadCounts[conversation._id] ?? 0}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
