"use client";

import { type KeyboardEvent, useLayoutEffect, useRef, useState } from "react";
import { FiSend } from "react-icons/fi";
import { Spinner } from "@/components/ui/Spinner";
import { ApiError } from "@/lib/api/client";
import { cn } from "@/lib/utils/cn";

const MAX_HEIGHT_PX = 132;

type MessageComposerProps = {
  onSend: (text: string) => Promise<void>;
};

export function MessageComposer({ onSend }: MessageComposerProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = text.trim().length > 0 && !sending;

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [text]);

  const submit = async () => {
    const trimmed = text.trim();
    if (trimmed.length === 0 || sending) return;

    setSending(true);
    setError(null);
    try {
      await onSend(trimmed);
      setText("");
      inputRef.current?.focus();
    } catch (caught) {
      setError(caught instanceof ApiError ? caught.message : "Message not sent. Try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void submit();
    }
  };

  return (
    <div className="shrink-0 border-t border-line bg-white px-3 py-2.5 sm:px-6 sm:py-3.5">
      {error ? (
        <p role="alert" className="mb-2 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
      <div className="flex items-end gap-2.5">
        <textarea
          ref={inputRef}
          rows={1}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message…"
          aria-label="Message"
          className="max-h-33 min-h-[42px] flex-1 resize-none rounded-[21px] bg-fill px-4 py-3 text-[13px] leading-tight text-ink placeholder:text-subtle focus:outline-2 focus:outline-brand/40 sm:min-h-[46px] sm:rounded-xl sm:text-sm"
        />
        <button
          type="button"
          onClick={() => void submit()}
          disabled={!canSend}
          aria-label="Send message"
          className={cn(
            "flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full transition-colors sm:h-[46px] sm:w-[46px] sm:rounded-xl",
            canSend ? "bg-brand text-white hover:bg-brand-dark" : "cursor-not-allowed bg-line text-subtle",
          )}
        >
          {sending ? <Spinner /> : <FiSend size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}
