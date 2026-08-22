const FALLBACK_HOST = "https://frontend-task-chatapp.onrender.com";

export const env = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? `${FALLBACK_HOST}/api`,
  socketUrl: process.env.NEXT_PUBLIC_SOCKET_URL ?? FALLBACK_HOST,
} as const;
