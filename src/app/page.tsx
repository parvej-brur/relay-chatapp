"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullScreenLoader } from "@/components/shared/FullScreenLoader";
import { useSession } from "@/hooks/useSession";

// The session lives in localStorage, so the entry point can only be resolved on the client.
export default function EntryPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    router.replace(status === "authenticated" ? "/chat" : "/login");
  }, [status, router]);

  return <FullScreenLoader />;
}
