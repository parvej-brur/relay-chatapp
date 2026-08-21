"use client";

import { useState } from "react";
import { PiChatTeardropDotsFill } from "react-icons/pi";
import { EmptyState } from "@/components/shared/EmptyState";
import type { useGroupActions } from "../hooks/useGroupActions";
import type { useMessages } from "../hooks/useMessages";
import type { Conversation } from "../types";
import { isGroup } from "../utils/conversationDisplay";
import { ChatHeader } from "./ChatHeader";
import { GroupInfoPanel } from "./GroupInfoPanel";
import { MessageComposer } from "./MessageComposer";
import { MessageList } from "./MessageList";

type ChatPanelProps = {
  conversation: Conversation | null;
  currentUserId: string;
  messages: ReturnType<typeof useMessages>;
  groupActions: ReturnType<typeof useGroupActions>;
  socketConnected: boolean;
  onSend: (text: string) => Promise<void>;
  onBack: () => void;
};

export function ChatPanel({
  conversation,
  currentUserId,
  messages,
  groupActions,
  socketConnected,
  onSend,
  onBack,
}: ChatPanelProps) {
  const [groupInfoOpen, setGroupInfoOpen] = useState(false);

  if (!conversation) {
    return (
      <div className="flex flex-1 items-center justify-center bg-surface">
        <EmptyState
          icon={<PiChatTeardropDotsFill size={28} />}
          title="Select a conversation"
          description="Pick a chat from the list, or start a new one."
        />
      </div>
    );
  }

  return (
    <section className="flex min-w-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <ChatHeader
          conversation={conversation}
          currentUserId={currentUserId}
          onBack={onBack}
          onOpenGroupInfo={() => setGroupInfoOpen(true)}
        />

        {!socketConnected ? (
          <p className="shrink-0 bg-amber-50 px-4 py-1.5 text-center text-[11px] font-medium text-amber-700">
            Reconnecting… new messages may be delayed.
          </p>
        ) : null}

        <MessageList
          conversation={conversation}
          currentUserId={currentUserId}
          messages={messages.messages}
          status={messages.status}
          error={messages.error}
          hasMore={messages.hasMore}
          loadingOlder={messages.loadingOlder}
          onLoadOlder={messages.loadOlder}
          onRetry={messages.reload}
        />

        <MessageComposer onSend={onSend} />
      </div>

      {groupInfoOpen && isGroup(conversation) ? (
        <GroupInfoPanel
          group={conversation}
          currentUserId={currentUserId}
          actions={groupActions}
          onClose={() => setGroupInfoOpen(false)}
        />
      ) : null}
    </section>
  );
}
