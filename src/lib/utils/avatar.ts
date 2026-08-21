import { AVATAR_COLORS, SENDER_NAME_COLORS } from "@/lib/constants/avatar-colors";

export function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function hash(seed: string): number {
  let total = 0;
  for (let index = 0; index < seed.length; index += 1) total = (total * 31 + seed.charCodeAt(index)) >>> 0;
  return total;
}

export function getAvatarColor(seed: string) {
  return AVATAR_COLORS[hash(seed) % AVATAR_COLORS.length];
}

export function getSenderColor(seed: string): string {
  return SENDER_NAME_COLORS[hash(seed) % SENDER_NAME_COLORS.length];
}
