import { Avatar } from "@/components/ui/Avatar";
import { FiX } from "react-icons/fi";
import type { User } from "@/types/user";

type SelectedMemberChipProps = {
  user: User;
  onRemove: (userId: string) => void;
};

export function SelectedMemberChip({ user, onRemove }: SelectedMemberChipProps) {
  return (
    <span className="flex items-center gap-1.5 rounded-full bg-brand-soft py-1 pr-2.5 pl-1">
      <Avatar name={user.name} seed={user._id} size="xs" />
      <span className="text-xs font-medium text-ink">{user.name}</span>
      <button
        type="button"
        onClick={() => onRemove(user._id)}
        aria-label={`Remove ${user.name}`}
        className="text-subtle transition-colors hover:text-ink"
      >
        <FiX size={12} aria-hidden="true" />
      </button>
    </span>
  );
}
