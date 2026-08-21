import { getAvatarColor, getInitials } from "@/lib/utils/avatar";
import { cn } from "@/lib/utils/cn";

const SIZES = {
  xs: "h-[22px] w-[22px] text-[8px]",
  sm: "h-9 w-9 text-xs",
  md: "h-10 w-10 text-[13px]",
  lg: "h-11 w-11 text-sm",
  xl: "h-16 w-16 text-[22px]",
} as const;

type AvatarProps = {
  name: string;
  seed?: string;
  size?: keyof typeof SIZES;
  className?: string;
};

export function Avatar({ name, seed, size = "lg", className }: AvatarProps) {
  const color = getAvatarColor(seed ?? name);

  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center rounded-full font-semibold select-none",
        SIZES[size],
        className,
      )}
      style={{ backgroundColor: color.background, color: color.foreground }}
      aria-hidden="true"
    >
      {getInitials(name)}
    </span>
  );
}
