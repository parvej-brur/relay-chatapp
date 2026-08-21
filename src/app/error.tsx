"use client";

import { Button } from "@/components/ui/Button";

export default function AppError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="max-w-sm text-sm text-muted">
        The page hit an unexpected error. Try again, and if it keeps happening reload the app.
      </p>
      {error.digest ? <p className="font-mono text-xs text-subtle">Reference: {error.digest}</p> : null}
      <Button onClick={() => retry()}>Try again</Button>
    </main>
  );
}
