import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-1 flex-col items-center justify-center px-6 py-10 text-center", className)}>
      {icon ? (
        <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-soft text-brand/70">
          {icon}
        </span>
      ) : null}
      <p className="text-base font-semibold text-ink">{title}</p>
      {description ? <p className="mt-1 text-[13px] text-subtle">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
