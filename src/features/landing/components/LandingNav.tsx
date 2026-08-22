"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { buttonClasses } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Logo } from "@/components/ui/Logo";
import { SITE } from "@/config/site";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-fill bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-320 items-center justify-between px-5 py-3.5 sm:px-8 lg:px-16">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <Logo size={32} />
          <span className="text-xl font-bold text-ink">{SITE.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted transition-colors duration-200 hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <Link href="/chat" className={buttonClasses({ size: "sm" })}>
            Get Started
          </Link>
        </nav>

        <IconButton
          icon={open ? <FiX size={20} /> : <FiMenu size={20} />}
          label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((current) => !current)}
          className="md:hidden"
        />
      </div>

      {open ? (
        <nav className="animate-fade-in-up flex flex-col gap-1 border-t border-fill px-5 py-4 md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-muted transition-colors duration-200 hover:bg-fill hover:text-ink"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/chat"
            onClick={() => setOpen(false)}
            className={buttonClasses({ size: "sm", className: "mt-2 w-full" })}
          >
            Get Started
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
