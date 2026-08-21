import { cn } from "@/lib/utils/cn";
import { formatMessageTime } from "@/lib/utils/date";
import type { Message } from "../types";

type MessageBubbleProps = {
  message: Message;
  outgoing: boolean;
  senderName?: string;
  senderColor?: string;
};

export function MessageBubble({ message, outgoing, senderName, senderColor }: MessageBubbleProps) {
  return (
    <div className={cn("flex flex-col", outgoing ? "items-end" : "items-start")}>
      {senderName ? (
        <span className="mb-0.5 pl-1 text-[11px] font-semibold" style={{ color: senderColor }}>
          {senderName}
        </span>
      ) : null}
      <div
        className={cn(
          "max-w-[80%] px-3.5 py-2.5 sm:max-w-[70%] lg:max-w-[65%]",
          outgoing
            ? "rounded-[16px_16px_4px_16px] bg-brand text-white"
            : "rounded-[16px_16px_16px_4px] bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
        )}
      >
        <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap sm:text-sm">
          {message.text}
        </p>
        <p
          className={cn(
            "mt-1 text-[10px] sm:text-[11px]",
            outgoing ? "text-right text-white/65" : "text-subtle",
          )}
        >
          {formatMessageTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
