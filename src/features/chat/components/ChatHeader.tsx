import { FiChevronLeft, FiUsers } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import type { Conversation } from "../types";
import { getConversationTitle, getGroupSubtitle, isGroup } from "../utils/conversationDisplay";

type ChatHeaderProps = {
  conversation: Conversation;
  currentUserId: string;
  onBack: () => void;
  onOpenGroupInfo: () => void;
};

export function ChatHeader({ conversation, currentUserId, onBack, onOpenGroupInfo }: ChatHeaderProps) {
  const title = getConversationTitle(conversation);
  const subtitle = isGroup(conversation)
    ? getGroupSubtitle(conversation, currentUserId)
    : conversation.participant.phone;

  return (
    <header className="flex shrink-0 items-center gap-3 border-b border-line bg-white px-3 py-2.5 sm:gap-3.5 sm:px-6 sm:py-3">
      <IconButton
        icon={<FiChevronLeft size={20} />}
        label="Back to conversations"
        onClick={onBack}
        className="md:hidden"
      />
      <Avatar name={title} seed={conversation._id} size="md" className="sm:h-[42px] sm:w-[42px]" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold text-ink sm:text-base">{title}</p>
        <p className="truncate text-[11px] text-subtle sm:text-xs">{subtitle}</p>
      </div>
      {isGroup(conversation) ? (
        <IconButton icon={<FiUsers size={18} />} label="Group info" onClick={onOpenGroupInfo} />
      ) : null}
    </header>
  );
}
