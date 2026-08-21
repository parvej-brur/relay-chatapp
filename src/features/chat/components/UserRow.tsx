import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils/cn";
import type { User } from "@/types/user";

type UserRowProps = {
  user: User;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
};

export function UserRow({ user, subtitle, trailing, onClick, disabled, className }: UserRowProps) {
  const content = (
    <>
      <Avatar name={user.name} seed={user._id} size="md" />
      <span className="min-w-0 flex-1 text-left">
        <span className="block truncate text-sm font-semibold text-ink">{user.name}</span>
        {subtitle ? <span className="block truncate text-xs text-subtle">{subtitle}</span> : null}
      </span>
      {trailing}
    </>
  );

  const classes = cn("flex w-full items-center gap-3 px-6 py-2.5", className);

  if (!onClick) return <div className={classes}>{content}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(classes, "transition-colors hover:bg-surface disabled:opacity-50")}
    >
      {content}
    </button>
  );
}
