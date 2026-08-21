import { FiAlertCircle } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
};

export function ErrorState({ title, description, onRetry, className }: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn("flex gap-2.5 rounded-[10px] border border-danger/30 bg-danger/5 p-4", className)}
    >
      <FiAlertCircle size={20} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
      <div>
        <p className="text-sm font-semibold text-danger-dark">{title}</p>
        {description ? <p className="mt-0.5 text-xs text-danger">{description}</p> : null}
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-[13px] font-semibold text-danger underline-offset-2 hover:underline"
          >
            Retry
          </button>
        ) : null}
      </div>
    </div>
  );
}
