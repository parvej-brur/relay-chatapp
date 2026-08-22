import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/config/site";

export function LandingFooter() {
  return (
    <footer className="flex flex-col items-center gap-3 bg-ink px-5 py-8 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left lg:px-16">
      <div className="flex items-center gap-2">
        <Logo size={24} tone="light" />
        <span className="text-[15px] font-semibold text-white">{SITE.name}</span>
      </div>
      <p className="text-[13px] text-muted">
        <span className="lg:hidden">© 2026 {SITE.name}</span>
        <span className="hidden lg:inline">© 2026 {SITE.name}. Built for the Taghyeer take home assessment.</span>
      </p>
    </footer>
  );
}
