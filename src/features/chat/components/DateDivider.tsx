export function DateDivider({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-2">
      <span className="rounded-[10px] bg-[#EDF0F4] px-3.5 py-1 text-[11px] font-semibold text-subtle sm:text-xs">
        {label}
      </span>
    </div>
  );
}
