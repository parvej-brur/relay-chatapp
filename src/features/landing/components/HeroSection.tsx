import Link from "next/link";
import { FiPlay } from "react-icons/fi";
import { buttonClasses } from "@/components/ui/Button";
import { ChatPreviewMock } from "./ChatPreviewMock";

export function HeroSection() {
  return (
    <section className="bg-linear-to-b from-surface to-white py-16 sm:py-20 lg:py-20">
      <div className="mx-auto flex max-w-320 flex-col items-center gap-12 px-5 text-center sm:px-8 lg:flex-row lg:items-center lg:px-16 lg:text-left">
        <div className="flex flex-1 flex-col items-center lg:items-start">
          <span className="animate-fade-in-up rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
            Real time chat, reimagined
          </span>
          <h1 className="animate-fade-in-up mt-5 text-[32px] leading-[1.15] font-extrabold tracking-[-0.5px] text-ink [animation-delay:100ms] sm:text-[40px] lg:text-[52px] lg:leading-[1.1] lg:tracking-[-1px]">
            Connect with anyone,
            <br />
            anywhere instantly.
          </h1>
          <p className="animate-fade-in-up mt-5 max-w-120 text-[15px] leading-relaxed text-muted [animation-delay:200ms] sm:text-base lg:text-[17px]">
            Pulse makes messaging effortless, whether it&apos;s a quick 1:1 chat or a full team group
            conversation. Fast, secure, and beautifully simple.
          </p>
          <div className="animate-fade-in-up mt-8 flex w-full flex-col gap-3 [animation-delay:300ms] sm:w-auto sm:flex-row">
            <Link href="/chat" className={buttonClasses({ size: "lg", className: "w-full sm:w-auto" })}>
              Start Chatting Free
            </Link>
            <a
              href="#preview"
              className={buttonClasses({ variant: "secondary", size: "lg", className: "w-full sm:w-auto" })}
            >
              <FiPlay size={18} />
              Watch Demo
            </a>
          </div>
        </div>

        <div id="preview" className="animate-fade-in-up flex w-full flex-1 justify-center scroll-mt-20 [animation-delay:150ms] lg:w-auto lg:justify-end">
          <div className="animate-float w-full lg:w-auto">
            <ChatPreviewMock />
          </div>
        </div>
      </div>
    </section>
  );
}
