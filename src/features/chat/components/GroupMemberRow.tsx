import { FiShield, FiUserMinus } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import type { User } from "@/types/user";

type GroupMemberRowProps = {
  member: User;
  isYou: boolean;
  isAdmin: boolean;
  canManage: boolean;
  onPromote: (userId: string) => void;
  onRemove: (userId: string) => void;
};

export function GroupMemberRow({
  member,
  isYou,
  isAdmin,
  canManage,
  onPromote,
  onRemove,
}: GroupMemberRowProps) {
  return (
    <div className="group flex items-center gap-2.5 px-5 py-2">
      <Avatar name={member.name} seed={member._id} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-semibold text-ink">{isYou ? "You" : member.name}</p>
        <p className="truncate text-[11px] text-subtle">{member.phone}</p>
      </div>
      {isAdmin ? (
        <span className="rounded-[5px] bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand">
          Admin
        </span>
      ) : null}
      {canManage ? (
        <span className="flex gap-0.5">
          {isAdmin ? null : (
            <IconButton
              icon={<FiShield size={15} />}
              label={`Make ${member.name} an admin`}
              className="h-8 w-8"
              onClick={() => onPromote(member._id)}
            />
          )}
          <IconButton
            icon={<FiUserMinus size={15} />}
            label={`Remove ${member.name}`}
            className="h-8 w-8 hover:bg-danger/10 hover:text-danger"
            onClick={() => onRemove(member._id)}
          />
        </span>
      ) : null}
    </div>
  );
}
