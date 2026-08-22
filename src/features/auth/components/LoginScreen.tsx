"use client";

import { useRouter } from "next/navigation";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/config/site";
import { LoginForm } from "./LoginForm";

export function LoginScreen() {
  const router = useRouter();

  return (
    <main className="flex min-h-dvh flex-col bg-white sm:bg-surface lg:flex-row lg:bg-white">
      <section className="hidden w-1/2 flex-col justify-center bg-linear-135 from-brand to-brand-dark p-16 lg:flex">
        <Logo size={56} tone="light" />
        <h1 className="mt-6 text-[42px] leading-[1.15] font-bold text-white">
          Connect with anyone,
          <br />
          anywhere.
        </h1>
        <p className="mt-4 max-w-105 text-base leading-relaxed text-white/70">
          Stay connected with real-time messaging for teams and friends. Start
          direct chats or create groups with ease.
        </p>
      </section>

      <section className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-8 lg:w-1/2">
        <div className="w-full max-w-100">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Logo size={48} className="lg:hidden" />
            <h1 className="mt-4 text-[26px] font-bold text-ink sm:text-[32px] lg:mt-0 lg:text-[28px]">
              Welcome to {SITE.name}
            </h1>
            <p className="mt-1.5 text-sm text-muted sm:text-[15px] lg:mb-9">
              Enter your phone number and name to get started. No separate
              signup needed.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border-line bg-white sm:border sm:p-8 sm:shadow-sm lg:mt-0 lg:border-0 lg:p-0 lg:shadow-none">
            <LoginForm onSuccess={() => router.replace("/chat")} />
          </div>

          <p className="mt-3 text-center text-xs leading-relaxed text-subtle">
            By continuing, you agree to our Terms of Service
          </p>
        </div>
      </section>
    </main>
  );
}
