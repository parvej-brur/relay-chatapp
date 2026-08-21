import { Spinner } from "@/components/ui/Spinner";

export function FullScreenLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center text-brand">
      <Spinner className="h-6 w-6" />
    </div>
  );
}
