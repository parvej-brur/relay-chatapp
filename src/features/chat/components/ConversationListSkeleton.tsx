import { Skeleton } from "@/components/ui/Skeleton";

const ROWS = ["w-[55%]", "w-[40%]", "w-[60%]", "w-[45%]", "w-[50%]"];

export function ConversationListSkeleton() {
  return (
    <div aria-hidden="true">
      {ROWS.map((width, index) => (
        <div key={index} className="flex items-center gap-3 px-4 py-3">
          <Skeleton className="h-11 w-11 rounded-full" />
          <div className="flex-1">
            <Skeleton className={`h-3 ${width}`} />
            <Skeleton className="mt-2 h-2.5 w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}
