"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FullScreenLoader } from "@/components/shared/FullScreenLoader";
import { useAuth } from "@/providers/AuthProvider";

type AuthGateProps = {
  children: React.ReactNode;
  requires: "authenticated" | "unauthenticated";
  redirectTo: string;
};

export function AuthGate({ children, requires, redirectTo }: AuthGateProps) {
  const { status } = useAuth();
  const router = useRouter();
  const allowed = status === requires;

  useEffect(() => {
    if (status !== "loading" && !allowed) router.replace(redirectTo);
  }, [status, allowed, redirectTo, router]);

  if (!allowed) return <FullScreenLoader />;

  return children;
}
