"use client";

import { Fragment } from "react";
import { FiArrowDown } from "react-icons/fi";
import { PiChatTeardropDotsFill } from "react-icons/pi";
import { Spinner } from "@/components/ui/Spinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { getSenderColor } from "@/lib/utils/avatar";
import { formatDayLabel, isSameDay } from "@/lib/utils/date";
import { useMessageScroll } from "../hooks/useMessageScroll";
import type { Conversation, Message, RequestStatus } from "../types";
import { findSender, isGroup } from "../utils/conversationDisplay";
import { DateDivider } from "./DateDivider";
import { MessageBubble } from "./MessageBubble";
import { MessageListSkeleton } from "./MessageListSkeleton";

type MessageListProps = {
  conversation: Conversation;
  currentUserId: string;
  messages: Message[];
  status: RequestStatus;
  error: string | null;
  hasMore: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: () => void;
};

export function MessageList({
  conversation,
  currentUserId,
  messages,
  status,
  error,
  hasMore,
  loadingOlder,
  onLoadOlder,
  onRetry,
}: MessageListProps) {
  const { containerRef, handleScroll, pinned, unseenCount, scrollToBottom } = useMessageScroll({
    messageCount: messages.length,
    canLoadOlder: hasMore && !loadingOlder && status === "success",
    onLoadOlder,
  });

  if (status === "loading" && messages.length === 0) return <MessageListSkeleton />;

  if (status === "error" && messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <ErrorState
          title="Unable to load messages"
          description={error ?? "Please check your connection and try again."}
          onRetry={onRetry}
          className="max-w-sm"
        />
      </div>
    );
  }

  const showSenderNames = isGroup(conversation);

  return (
    <div className="relative flex flex-1 overflow-hidden bg-surface">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex flex-1 flex-col gap-1.5 overflow-y-auto px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8"
      >
        {loadingOlder ? (
          <div className="flex justify-center py-2 text-subtle">
            <Spinner />
          </div>
        ) : null}

        {messages.length === 0 ? (
          <EmptyState
            icon={<PiChatTeardropDotsFill size={28} />}
            title="No messages yet"
            description="Send the first message to get this conversation started."
          />
        ) : null}

        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const outgoing = message.sender === currentUserId;
          const startsNewDay = !previous || !isSameDay(previous.createdAt, message.createdAt);
          const startsNewSender = !previous || previous.sender !== message.sender || startsNewDay;
          const sender = showSenderNames && !outgoing ? findSender(conversation, message.sender) : undefined;

          return (
            <Fragment key={message._id}>
              {startsNewDay ? <DateDivider label={formatDayLabel(message.createdAt)} /> : null}
              <MessageBubble
                message={message}
                outgoing={outgoing}
                senderName={sender && startsNewSender ? sender.name : undefined}
                senderColor={sender ? getSenderColor(sender._id) : undefined}
              />
            </Fragment>
          );
        })}
      </div>

      {!pinned && messages.length > 0 ? (
        <button
          type="button"
          onClick={() => scrollToBottom()}
          className="absolute right-4 bottom-4 flex items-center gap-1.5 rounded-full bg-brand py-2 pr-3.5 pl-3 text-xs font-semibold text-white shadow-lg transition-colors hover:bg-brand-dark sm:right-6"
        >
          <FiArrowDown size={14} aria-hidden="true" />
          {unseenCount > 0 ? `${unseenCount} new message${unseenCount > 1 ? "s" : ""}` : "Latest"}
        </button>
      ) : null}
    </div>
  );
}
