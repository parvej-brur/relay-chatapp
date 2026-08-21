"use client";

import { useState } from "react";
import { FiEdit2, FiLogOut, FiX } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { ErrorState } from "@/components/shared/ErrorState";
import type { useGroupActions } from "../hooks/useGroupActions";
import type { GroupConversation } from "../types";
import { AddMembersSection } from "./AddMembersSection";
import { GroupMemberRow } from "./GroupMemberRow";

type GroupInfoPanelProps = {
  group: GroupConversation;
  currentUserId: string;
  actions: ReturnType<typeof useGroupActions>;
  onClose: () => void;
};

export function GroupInfoPanel({ group, currentUserId, actions, onClose }: GroupInfoPanelProps) {
  const [draftName, setDraftName] = useState<string | null>(null);
  const [addingMembers, setAddingMembers] = useState(false);

  const isAdmin = group.admins.includes(currentUserId);
  const memberIds = group.participants.map((member) => member._id);

  const saveName = () => {
    const trimmed = draftName?.trim() ?? "";
    if (trimmed && trimmed !== group.name) actions.rename(group._id, trimmed);
    setDraftName(null);
  };

  return (
    <aside className="fixed inset-0 z-40 flex flex-col bg-white lg:static lg:z-auto lg:w-90 lg:shrink-0 lg:border-l lg:border-line">
      <header className="flex shrink-0 items-center justify-between border-b border-line px-5 py-4">
        <h2 className="text-lg font-bold text-ink">Group Info</h2>
        <IconButton
          icon={<FiX size={18} />}
          label="Close group info"
          onClick={onClose}
          className="h-8 w-8"
        />
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center px-5 pt-6 pb-5">
          <Avatar name={group.name} seed={group._id} size="xl" />
          {draftName === null ? (
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-lg font-bold text-ink">{group.name}</span>
              {isAdmin ? (
                <IconButton
                  icon={<FiEdit2 size={14} />}
                  label="Rename group"
                  className="h-7 w-7"
                  onClick={() => setDraftName(group.name)}
                />
              ) : null}
            </div>
          ) : (
            <div className="mt-3 flex w-full items-center gap-2">
              <input
                autoFocus
                value={draftName}
                onChange={(event) => setDraftName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") saveName();
                  if (event.key === "Escape") setDraftName(null);
                }}
                aria-label="Group name"
                className="h-10 flex-1 rounded-[10px] border-[1.5px] border-line px-3 text-sm font-semibold text-ink focus:border-brand focus:outline-none"
              />
              <Button size="sm" loading={actions.pending === "rename"} onClick={saveName}>
                Save
              </Button>
            </div>
          )}
        </div>

        {actions.error ? (
          <div className="px-5 pb-3">
            <ErrorState title="Action failed" description={actions.error} />
          </div>
        ) : null}

        <div className="flex items-center justify-between px-5 pb-2">
          <span className="text-xs font-semibold tracking-wide text-subtle uppercase">
            {group.participants.length} Members
          </span>
          {isAdmin ? (
            <button
              type="button"
              onClick={() => setAddingMembers((current) => !current)}
              className="text-[13px] font-semibold text-brand"
            >
              {addingMembers ? "Done" : "Add Member"}
            </button>
          ) : null}
        </div>

        {addingMembers ? (
          <AddMembersSection
            existingMemberIds={memberIds}
            onAdd={(userId) => actions.addMembers(group._id, [userId])}
          />
        ) : null}

        <div className="pb-4">
          {group.participants.map((member) => (
            <GroupMemberRow
              key={member._id}
              member={member}
              isYou={member._id === currentUserId}
              isAdmin={group.admins.includes(member._id)}
              canManage={isAdmin && member._id !== currentUserId}
              onPromote={(userId) => actions.promote(group._id, userId)}
              onRemove={(userId) => actions.removeMember(group._id, userId)}
            />
          ))}
        </div>
      </div>

      <div className="shrink-0 border-t border-line px-5 py-4">
        <Button
          variant="danger"
          className="w-full"
          loading={actions.pending === "leave"}
          onClick={() => actions.leave(group._id)}
        >
          <FiLogOut size={16} aria-hidden="true" />
          Leave Group
        </Button>
      </div>
    </aside>
  );
}
