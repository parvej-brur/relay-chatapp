"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullScreenLoader } from "@/components/shared/FullScreenLoader";
import { useIsHydrated } from "@/hooks/useIsHydrated";
import { useSession } from "@/hooks/useSession";

type AuthGateProps = {
  children: React.ReactNode;
  requires: "authenticated" | "unauthenticated";
  redirectTo: string;
};

export function AuthGate({ children, requires, redirectTo }: AuthGateProps) {
  const { status } = useSession();
  const hydrated = useIsHydrated();
  const router = useRouter();

  const allowed = hydrated && status === requires;

  useEffect(() => {
    if (hydrated && status !== "loading" && status !== requires)
      router.replace(redirectTo);
  }, [hydrated, status, requires, redirectTo, router]);

  if (!allowed) return <FullScreenLoader />;

  return children;
}
