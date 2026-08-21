const TIME_FORMAT = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
const WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const LONG_WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "long" });
const DATE_FORMAT = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short", year: "numeric" });
const SHORT_DATE_FORMAT = new Intl.DateTimeFormat("en-US", { day: "2-digit", month: "2-digit", year: "2-digit" });

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

function daysAgo(date: Date, now: Date): number {
  return Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
}

export function isSameDay(a: string, b: string): boolean {
  return startOfDay(new Date(a)) === startOfDay(new Date(b));
}

export function formatMessageTime(iso: string): string {
  return TIME_FORMAT.format(new Date(iso));
}

export function formatDayLabel(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const distance = daysAgo(date, now);
  if (distance === 0) return "Today";
  if (distance === 1) return "Yesterday";
  if (distance < 7) return LONG_WEEKDAY_FORMAT.format(date);
  return DATE_FORMAT.format(date);
}

export function formatConversationTime(iso: string, now = new Date()): string {
  const date = new Date(iso);
  const distance = daysAgo(date, now);
  if (distance === 0) return TIME_FORMAT.format(date);
  if (distance === 1) return "Yesterday";
  if (distance < 7) return WEEKDAY_FORMAT.format(date);
  return SHORT_DATE_FORMAT.format(date);
}
