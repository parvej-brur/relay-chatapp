import { FiSend } from "react-icons/fi";
import { Avatar } from "@/components/ui/Avatar";

const MESSAGES = [
  {
    from: "them",
    text: "Hey! Have you looked at the design files?",
    time: "2:30 PM",
  },
  { from: "me", text: "Yes! The new layout looks great.", time: "2:31 PM" },
  { from: "them", text: "When are you free to review?", time: "2:34 PM" },
] as const;

export function ChatPreviewMock() {
  return (
    <div className="w-full max-w-120 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_20px_60px_rgba(108,92,231,0.15),0_1px_3px_rgba(0,0,0,0.06)] lg:max-w-120">
      <div className="flex items-center gap-3 border-b border-fill px-5 py-3.5">
        <div className="relative">
          <Avatar name="Parvej Sikdar" size="sm" />
          <span className="animate-pulse-dot absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <p className="text-sm font-semibold text-ink">Parvej Sikdar</p>
      </div>

      <div className="flex min-h-65 flex-col gap-2 bg-surface p-5">
        {MESSAGES.map((message, index) => (
          <div
            key={message.text}
            className={`animate-fade-in-up flex ${message.from === "me" ? "justify-end" : "justify-start"}`}
            style={{ animationDelay: `${400 + index * 220}ms` }}
          >
            <div
              className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 ${
                message.from === "me"
                  ? "rounded-br-[4px] bg-brand text-white"
                  : "rounded-bl-[4px] bg-white text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
              }`}
            >
              <p className="text-[13px] leading-snug">{message.text}</p>
              <p
                className={`mt-0.5 text-[9px] ${
                  message.from === "me"
                    ? "text-right text-white/60"
                    : "text-subtle"
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 border-t border-fill px-4 py-3">
        <div className="h-9.5 flex-1 rounded-[10px] bg-fill px-3 text-xs leading-9.5 text-subtle">
          Type a message…
        </div>
        <div className="flex h-9.5 w-9.5 shrink-0 items-center justify-center rounded-[10px] bg-brand text-white transition-transform hover:scale-105">
          <FiSend size={16} />
        </div>
      </div>
    </div>
  );
}
