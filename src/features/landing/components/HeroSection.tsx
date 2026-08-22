import Link from "next/link";
import { FiPlay } from "react-icons/fi";
import { buttonClasses } from "@/components/ui/Button";
import { ChatPreviewMock } from "./ChatPreviewMock";

export function HeroSection() {
  return (
    <section className="bg-linear-to-b from-surface to-white py-16 sm:py-20 lg:py-20">
      <div className="mx-auto flex max-w-320 flex-col items-center gap-12 px-5 text-center sm:px-8 lg:flex-row lg:items-center lg:px-16 lg:text-left">
        <div className="flex flex-1 flex-col items-center lg:items-start">
          <span className="rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
            Real time chat, reimagined
          </span>
          <h1 className="mt-5 text-[32px] leading-[1.15] font-extrabold tracking-[-0.5px] text-ink sm:text-[40px] lg:text-[52px] lg:leading-[1.1] lg:tracking-[-1px]">
            Connect with anyone,
            <br />
            anywhere instantly.
          </h1>
          <p className="mt-5 max-w-120 text-[15px] leading-relaxed text-muted sm:text-base lg:text-[17px]">
            Pulse makes messaging effortless, whether it&apos;s a quick 1:1 chat or a full team group
            conversation. Fast, secure, and beautifully simple.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/chat" className={buttonClasses({ size: "lg" })}>
              Start Chatting Free
            </Link>
            <a href="#preview" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              <FiPlay size={18} />
              Watch Demo
            </a>
          </div>
        </div>

        <div id="preview" className="flex flex-1 justify-center scroll-mt-20">
          <ChatPreviewMock />
        </div>
      </div>
    </section>
  );
}
