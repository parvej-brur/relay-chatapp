import type { IconType } from "react-icons";
import { FiEdit2, FiLock, FiMessageSquare, FiSearch, FiSend, FiUsers } from "react-icons/fi";

type Feature = {
  icon: IconType;
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    icon: FiSend,
    title: "Real Time Messaging",
    description:
      "Messages arrive instantly via WebSocket. No refreshing needed. See new messages the moment they're sent.",
  },
  {
    icon: FiUsers,
    title: "Group Conversations",
    description:
      "Create group chats with multiple participants. Manage members, assign admins, and keep your team organized.",
  },
  {
    icon: FiSearch,
    title: "Quick User Search",
    description: "Find anyone by name or phone number and start a conversation in seconds. No contact list needed.",
  },
  {
    icon: FiLock,
    title: "Secure Authentication",
    description: "JWT based authentication with a seamless login experience. Enter your phone number and you're in.",
  },
  {
    icon: FiEdit2,
    title: "Smart Auto Scroll",
    description: "New messages scroll into view automatically, but won't interrupt you when you're reading older messages.",
  },
  {
    icon: FiMessageSquare,
    title: "Message History",
    description: "Full conversation history with timestamps, pagination, and clear sender/receiver distinction.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-16 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-320 px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-140 text-center">
          <p className="text-[13px] font-semibold tracking-[1px] text-brand uppercase">Features</p>
          <h2 className="mt-2.5 text-[26px] font-extrabold tracking-[-0.5px] text-ink sm:text-[32px] lg:text-[36px]">
            Everything you need to stay connected
          </h2>
          <p className="mt-3 text-[15px] text-muted lg:text-base">
            Simple, powerful features designed for seamless communication.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:mt-12 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-fill bg-surface p-6 sm:p-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft">
                <feature.icon size={24} className="text-brand" />
              </div>
              <h3 className="mt-5 text-lg font-bold text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
