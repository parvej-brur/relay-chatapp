import { FiChevronDown } from "react-icons/fi";

const DIAL_CODES = ["+1", "+20", "+44", "+91", "+880", "+966", "+971"] as const;

type CountryCodeSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  return (
    <div className="relative flex h-12 shrink-0 items-center gap-1 rounded-[10px] border-[1.5px] border-line bg-surface pr-3 pl-3.5 text-sm text-muted focus-within:border-brand">
      <select
        aria-label="Country dialling code"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none bg-transparent pr-4 focus:outline-none"
      >
        {DIAL_CODES.map((code) => (
          <option key={code} value={code}>
            {code}
          </option>
        ))}
      </select>
      <FiChevronDown size={12} className="pointer-events-none absolute right-3 text-subtle" aria-hidden="true" />
    </div>
  );
}
