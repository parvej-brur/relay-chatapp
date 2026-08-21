"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";

const PINNED_THRESHOLD_PX = 80;
const LOAD_OLDER_THRESHOLD_PX = 120;

type MessageScrollOptions = {
  messageCount: number;
  canLoadOlder: boolean;
  onLoadOlder: () => void;
};

// Keeps the view glued to the newest message, but never yanks the reader back down
// while they are reading history — new arrivals surface through `unseenCount` instead.
export function useMessageScroll({
  messageCount,
  canLoadOlder,
  onLoadOlder,
}: MessageScrollOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(true);
  const previousHeightRef = useRef<number | null>(null);
  const previousCountRef = useRef(0);
  const [pinned, setPinned] = useState(true);
  const [unseenCount, setUnseenCount] = useState(0);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
    pinnedRef.current = true;
    setPinned(true);
    setUnseenCount(0);
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || messageCount === 0) return;

    const prependedHeight = previousHeightRef.current;
    if (prependedHeight !== null) {
      container.scrollTop += container.scrollHeight - prependedHeight;
      previousHeightRef.current = null;
    } else if (pinnedRef.current) {
      container.scrollTop = container.scrollHeight;
    } else if (messageCount > previousCountRef.current) {
      setUnseenCount((current) => current + messageCount - previousCountRef.current);
    }

    previousCountRef.current = messageCount;
  }, [messageCount]);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    const isPinned = distanceFromBottom <= PINNED_THRESHOLD_PX;
    pinnedRef.current = isPinned;
    setPinned(isPinned);
    if (isPinned) setUnseenCount(0);

    if (container.scrollTop <= LOAD_OLDER_THRESHOLD_PX && canLoadOlder) {
      previousHeightRef.current = container.scrollHeight;
      onLoadOlder();
    }
  }, [canLoadOlder, onLoadOlder]);

  return { containerRef, handleScroll, pinned, unseenCount, scrollToBottom };
}
