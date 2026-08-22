import type { ButtonHTMLAttributes } from "react";
import { Spinner } from "@/components/ui/Spinner";
import { cn } from "@/lib/utils/cn";

const VARIANTS = {
  primary: "bg-brand text-white hover:bg-brand-dark disabled:bg-brand/50",
  secondary: "border-[1.5px] border-line bg-white text-ink hover:bg-fill",
  inverse: "bg-white text-brand hover:bg-white/90",
  danger: "border-[1.5px] border-danger/40 text-danger hover:bg-danger/5",
} as const;

const SIZES = {
  sm: "h-10 px-5 text-[13px] rounded-[10px]",
  md: "h-12 px-5 text-[15px] rounded-xl",
  lg: "h-13 px-6 text-base rounded-xl",
} as const;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  loading?: boolean;
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: keyof typeof VARIANTS;
  size?: keyof typeof SIZES;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-semibold transition-[color,background-color,border-color,transform] duration-150",
    "hover:scale-[1.02] active:scale-[0.97] disabled:hover:scale-100 disabled:active:scale-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={cn(
        buttonClasses({ variant, size }),
        "disabled:cursor-not-allowed",
        className,
      )}
      {...props}
    >
      {loading ? <Spinner /> : null}
      {children}
    </button>
  );
}
