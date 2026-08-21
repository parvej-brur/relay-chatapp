import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils/cn";

const ROWS = [
  { outgoing: false, width: "w-52" },
  { outgoing: true, width: "w-64" },
  { outgoing: false, width: "w-44" },
  { outgoing: true, width: "w-56" },
  { outgoing: false, width: "w-60" },
];

export function MessageListSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-3 p-6" aria-hidden="true">
      {ROWS.map((row, index) => (
        <div key={index} className={cn("flex", row.outgoing ? "justify-end" : "justify-start")}>
          <Skeleton className={cn("h-12 max-w-[70%] rounded-2xl", row.width)} />
        </div>
      ))}
    </div>
  );
}
