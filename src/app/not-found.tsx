import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-bold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-muted">That page does not exist or has moved.</p>
      <Link href="/chat" className="text-sm font-semibold text-brand underline underline-offset-4">
        Back to your chats
      </Link>
    </main>
  );
}
