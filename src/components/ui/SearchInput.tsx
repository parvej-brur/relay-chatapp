import type { InputHTMLAttributes } from "react";
import { FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils/cn";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  return (
    <div
      className={cn(
        "flex h-10 items-center gap-2 rounded-[10px] bg-fill px-3 text-subtle focus-within:ring-2 focus-within:ring-brand/30",
        className,
      )}
    >
      <FiSearch size={15} className="shrink-0" aria-hidden="true" />
      <input
        type="search"
        className="w-full bg-transparent text-[13px] text-ink placeholder:text-subtle focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        {...props}
      />
    </div>
  );
}
