import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

const VARIANTS = {
  ghost: "text-muted hover:bg-fill",
  brand: "bg-brand text-white hover:bg-brand-dark",
} as const;

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: ReactNode;
  label: string;
  variant?: keyof typeof VARIANTS;
};

export function IconButton({ icon, label, variant = "ghost", className, ...props }: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        VARIANTS[variant],
        className,
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
