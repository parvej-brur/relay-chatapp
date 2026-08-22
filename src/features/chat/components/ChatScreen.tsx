"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import { useChat } from "../hooks/useChat";
import { useGroupActions } from "../hooks/useGroupActions";
import { ChatPanel } from "./ChatPanel";
import { ConversationSidebar } from "./ConversationSidebar";
import { NewConversationModal } from "./NewConversationModal";

export function ChatScreen() {
  const chat = useChat();
  const [newConversationOpen, setNewConversationOpen] = useState(false);
  const groupActions = useGroupActions();

  const hasActiveConversation = chat.activeConversation !== null;

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-white">
      <div className={cn("h-full shrink-0", hasActiveConversation ? "hidden md:flex" : "flex w-full md:w-auto")}>
        <ConversationSidebar
          conversations={chat.conversations}
          status={chat.conversationsStatus}
          error={chat.conversationsError}
          currentUserId={chat.currentUserId}
          activeConversationId={chat.activeConversation?._id ?? null}
          unreadCounts={chat.unreadCounts}
          onSelect={chat.selectConversation}
          onRetry={chat.reloadConversations}
          onStartConversation={() => setNewConversationOpen(true)}
        />
      </div>

      <div className={cn("h-full min-w-0 flex-1", hasActiveConversation ? "flex" : "hidden md:flex")}>
        <ChatPanel
          key={chat.activeConversation?._id ?? "none"}
          conversation={chat.activeConversation}
          currentUserId={chat.currentUserId}
          messages={chat.messages}
          groupActions={groupActions}
          socketConnected={chat.socketConnected}
          onSend={chat.sendText}
          onBack={() => chat.selectConversation(null)}
        />
      </div>

      <NewConversationModal
        open={newConversationOpen}
        onClose={() => setNewConversationOpen(false)}
        onStartDirect={chat.startDirectConversation}
        onCreateGroup={chat.startGroupConversation}
      />
    </div>
  );
}
