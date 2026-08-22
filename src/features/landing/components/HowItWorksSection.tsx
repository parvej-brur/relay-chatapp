import { Fragment } from "react";
import { ScrollReveal } from "./ScrollReveal";

type Step = {
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    title: "Sign In",
    description: "Enter your phone number and display name. If you're new, you're automatically registered.",
  },
  {
    title: "Find People",
    description: "Search by name or phone number to find who you want to chat with, or create a group.",
  },
  {
    title: "Start Chatting",
    description: "Send messages in real time. Messages appear instantly, no refresh needed.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-16 bg-surface py-16 sm:py-20">
      <div className="mx-auto max-w-240 px-5 sm:px-8 lg:px-16">
        <div className="text-center">
          <p className="text-[13px] font-semibold tracking-[1px] text-brand uppercase">How It Works</p>
          <h2 className="mt-2.5 text-[26px] font-extrabold tracking-[-0.5px] text-ink sm:text-[32px] lg:text-[36px]">
            Up and running in three steps
          </h2>
        </div>

        <div className="mt-10 hidden md:flex md:items-start md:justify-center lg:mt-14">
          {STEPS.map((step, index) => (
            <Fragment key={step.title}>
              <div className="flex w-56 shrink-0 justify-center lg:w-64">
                <ScrollReveal delay={index * 150}>
                  <StepCard step={step} number={index + 1} />
                </ScrollReveal>
              </div>
              {index < STEPS.length - 1 ? (
                <div className="flex w-16 shrink-0 items-start justify-center pt-6 lg:w-20">
                  {index === 0 ? <CurveArrow direction="down" /> : <CurveArrow direction="up" />}
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center md:hidden">
          {STEPS.map((step, index) => (
            <Fragment key={step.title}>
              <ScrollReveal delay={index * 150}>
                <StepCard step={step} number={index + 1} />
              </ScrollReveal>
              {index < STEPS.length - 1 ? (
                <div className="my-1 flex justify-center">
                  <VerticalArrow />
                </div>
              ) : null}
            </Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCard({ step, number }: { step: Step; number: number }) {
  return (
    <div className="max-w-xs flex-1 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand text-[22px] font-bold text-white">
        {number}
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{step.description}</p>
    </div>
  );
}

// Decorative connector between step cards, dashed to read as a path rather than a divider.
function CurveArrow({ direction }: { direction: "down" | "up" }) {
  const d = direction === "down" ? "M6 20 C 40 62, 100 62, 138 26" : "M6 46 C 40 6, 100 6, 138 40";
  const head = direction === "down" ? "M138 26 l -3 9 M138 26 l -9 3" : "M138 40 l -9 -3 M138 40 l -3 -9";

  return (
    <ScrollReveal delay={250} className="h-9 w-full duration-1000! lg:h-11">
      <svg viewBox="0 0 144 66" fill="none" preserveAspectRatio="none" className="h-9 w-full text-brand lg:h-11" aria-hidden="true">
        <path d={d} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="10 6" pathLength={100} />
        <path d={head} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ScrollReveal>
  );
}

function VerticalArrow() {
  return (
    <ScrollReveal delay={250} className="duration-1000!">
      <svg viewBox="0 0 48 72" fill="none" className="h-14 w-10 text-brand" aria-hidden="true">
        <path
          d="M24 4 C 6 22, 42 44, 24 68"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="10 6"
          pathLength={100}
        />
        <path d="M24 68 l -6 -6 M24 68 l 6 -6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </ScrollReveal>
  );
}
