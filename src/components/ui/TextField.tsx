import type { InputHTMLAttributes, ReactNode } from "react";
import { useId } from "react";
import { cn } from "@/lib/utils/cn";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  leadingSlot?: ReactNode;
  error?: string;
};

export function TextField({ label, leadingSlot, error, className, id, ...props }: TextFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="w-full">
      {label ? (
        <label htmlFor={inputId} className="mb-1.5 block text-[13px] font-semibold text-ink">
          {label}
        </label>
      ) : null}
      <div className="flex gap-2">
        {leadingSlot}
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          className={cn(
            "h-12 w-full rounded-[10px] border-[1.5px] bg-surface px-3.5 text-[15px] text-ink transition-colors",
            "placeholder:text-subtle focus:border-brand focus:bg-white focus:outline-none",
            error ? "border-danger" : "border-line",
            className,
          )}
          {...props}
        />
      </div>
      {error ? <p className="mt-1.5 text-xs font-medium text-danger">{error}</p> : null}
    </div>
  );
}
