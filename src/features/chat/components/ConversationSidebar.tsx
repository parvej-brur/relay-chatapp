"use client";

import { useState } from "react";
import { FiLogOut, FiPlus } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { SearchInput } from "@/components/ui/SearchInput";
import { useSession } from "@/hooks/useSession";
import type { Conversation, RequestStatus } from "../types";
import { matchesConversationQuery } from "../utils/conversationDisplay";
import { ConversationList } from "./ConversationList";

type ConversationSidebarProps = {
  conversations: Conversation[];
  status: RequestStatus;
  error: string | null;
  currentUserId: string;
  activeConversationId: string | null;
  unreadCounts: Record<string, number>;
  onSelect: (conversationId: string) => void;
  onRetry: () => void;
  onStartConversation: () => void;
};

export function ConversationSidebar({
  conversations,
  status,
  error,
  currentUserId,
  activeConversationId,
  unreadCounts,
  onSelect,
  onRetry,
  onStartConversation,
}: ConversationSidebarProps) {
  const { user, logout } = useSession();
  const [query, setQuery] = useState("");
  const visible = conversations.filter((conversation) => matchesConversationQuery(conversation, query));

  return (
    <aside className="flex h-full w-full flex-col border-line md:w-70 md:border-r lg:w-90">
      <header className="flex shrink-0 items-center justify-between px-4 pt-4 pb-3 lg:px-5 lg:pt-5">
        <div className="flex items-center gap-2.5">
          <Logo size={28} className="hidden md:block" />
          <h1 className="text-2xl font-bold text-ink md:text-xl">Chats</h1>
        </div>
        <IconButton
          icon={<FiPlus size={16} />}
          label="New conversation"
          variant="brand"
          onClick={onStartConversation}
        />
      </header>

      <div className="shrink-0 px-4 pb-3">
        <SearchInput
          placeholder="Search conversations…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      <div className="flex flex-1 flex-col overflow-y-auto">
        <ConversationList
          conversations={visible}
          status={status}
          error={error}
          searchQuery={query}
          currentUserId={currentUserId}
          activeConversationId={activeConversationId}
          unreadCounts={unreadCounts}
          onSelect={onSelect}
          onRetry={onRetry}
          onStartConversation={onStartConversation}
        />
      </div>

      {user ? (
        <footer className="flex shrink-0 items-center gap-2.5 border-t border-line px-4 py-3">
          <Avatar name={user.name} seed={user._id} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-ink">{user.name}</p>
            <p className="truncate text-[11px] text-subtle">{user.phone}</p>
          </div>
          <IconButton icon={<FiLogOut size={18} />} label="Sign out" onClick={logout} />
        </footer>
      ) : null}
    </aside>
  );
}
