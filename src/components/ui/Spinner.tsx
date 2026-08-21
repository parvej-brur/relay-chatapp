import { cn } from "@/lib/utils/cn";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn(
        "h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-current/30 border-t-current",
        className,
      )}
    />
  );
}
