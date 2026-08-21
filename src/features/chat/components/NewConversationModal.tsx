"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { cn } from "@/lib/utils/cn";
import { DirectMessageTab } from "./DirectMessageTab";
import { NewGroupTab } from "./NewGroupTab";

const TABS = [
  { id: "direct", label: "Direct Message" },
  { id: "group", label: "New Group" },
] as const;

type TabId = (typeof TABS)[number]["id"];

type NewConversationModalProps = {
  open: boolean;
  onClose: () => void;
  onStartDirect: (userId: string) => Promise<void>;
  onCreateGroup: (name: string, participantIds: string[]) => Promise<void>;
};

export function NewConversationModal({
  open,
  onClose,
  onStartDirect,
  onCreateGroup,
}: NewConversationModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("direct");

  const close = () => {
    setActiveTab("direct");
    onClose();
  };

  const runAndClose = async (action: Promise<void>) => {
    await action;
    close();
  };

  return (
    <Modal open={open} title="New Conversation" onClose={close} className="sm:max-h-[640px]">
      <div role="tablist" className="flex shrink-0 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 border-b-2 py-3 text-sm transition-colors",
              activeTab === tab.id
                ? "border-brand font-semibold text-brand"
                : "border-transparent font-medium text-subtle hover:text-muted",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "direct" ? (
        <DirectMessageTab onStart={(userId) => runAndClose(onStartDirect(userId))} />
      ) : (
        <NewGroupTab onCreate={(name, ids) => runAndClose(onCreateGroup(name, ids))} />
      )}
    </Modal>
  );
}
