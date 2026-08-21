import { PiChatTeardropDotsFill } from "react-icons/pi";
import { cn } from "@/lib/utils/cn";

type LogoProps = {
  size?: number;
  tone?: "brand" | "light";
  className?: string;
};

export function Logo({ size = 28, tone = "brand", className }: LogoProps) {
  return (
    <span
      aria-hidden="true"
      style={{ width: size, height: size, borderRadius: size * 0.29 }}
      className={cn(
        "flex shrink-0 items-center justify-center text-white",
        tone === "brand" ? "bg-brand" : "bg-white/15",
        className,
      )}
    >
      <PiChatTeardropDotsFill size={size * 0.58} />
    </span>
  );
}
