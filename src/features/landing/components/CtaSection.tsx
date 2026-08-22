import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="bg-linear-135 from-brand to-brand-dark py-16 text-center sm:py-20">
      <div className="mx-auto max-w-320 px-5 sm:px-8 lg:px-16">
        <h2 className="text-[26px] leading-[1.15] font-extrabold tracking-[-0.5px] text-white sm:text-[32px] lg:text-[40px]">
          Ready to start chatting?
        </h2>
        <p className="mx-auto mt-4 max-w-120 text-sm leading-relaxed text-white/75 sm:text-base lg:text-[17px]">
          Join Pulse today and experience fast, simple, real time messaging, for free.
        </p>
        <div className="mt-8 flex justify-center">
          <Link href="/chat" className={buttonClasses({ variant: "inverse", size: "lg", className: "font-bold" })}>
            Get Started Free
          </Link>
        </div>
      </div>
    </section>
  );
}
