import { FiChevronDown } from "react-icons/fi";

const COUNTRIES = [
  { dialCode: "+880", iso: "BD", flag: "🇧🇩" },
  { dialCode: "+1", iso: "US", flag: "🇺🇸" },
  { dialCode: "+44", iso: "UK", flag: "🇬🇧" },
  { dialCode: "+20", iso: "EG", flag: "🇪🇬" },
  { dialCode: "+91", iso: "IN", flag: "🇮🇳" },
  { dialCode: "+966", iso: "SA", flag: "🇸🇦" },
  { dialCode: "+971", iso: "AE", flag: "🇦🇪" },
] as const;

type CountryCodeSelectProps = {
  value: string;
  onChange: (value: string) => void;
};

export function CountryCodeSelect({ value, onChange }: CountryCodeSelectProps) {
  const selected =
    COUNTRIES.find((country) => country.dialCode === value) ?? COUNTRIES[0];

  return (
    <div className="relative flex h-12 shrink-0 items-center rounded-[10px] border-[1.5px] border-line bg-surface pl-2.5 pr-7 text-sm text-ink transition-colors focus-within:border-brand">
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-fill text-xl leading-none">
          {selected.flag}
        </span>
        <span className="font-semibold">{selected.dialCode}</span>
      </span>
      <select
        aria-label="Country dialling code"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer appearance-none opacity-0"
      >
        {COUNTRIES.map((country) => (
          <option key={country.dialCode} value={country.dialCode}>
            {country.flag} {country.iso} {country.dialCode}
          </option>
        ))}
      </select>
      <FiChevronDown
        size={12}
        className="pointer-events-none absolute right-3 text-subtle"
        aria-hidden="true"
      />
    </div>
  );
}
