"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

// React uses the server snapshot while it hydrates and the client snapshot afterwards
export function useIsHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
