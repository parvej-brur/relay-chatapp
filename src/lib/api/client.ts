import { env } from "@/config/env";
import { readStoredToken } from "@/lib/auth/session";

export class ApiError extends Error {
  readonly status: number;
  // Auth failures carry string codes ("INVALID_TOKEN"); server faults carry numbers.
  readonly code?: string | number;

  constructor(message: string, status: number, code?: string | number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | undefined>;
  signal?: AbortSignal;
  auth?: boolean;
};

// The API answers errors as { error: { message, code } } rather than the { message } the spec promises.
function readErrorMessage(
  payload: unknown,
  status: number,
): { message: string; code?: string | number } {
  if (payload && typeof payload === "object") {
    const error = (
      payload as { error?: { message?: string; code?: string | number } }
    ).error;
    if (error?.message) return { message: error.message, code: error.code };
    const message = (payload as { message?: string }).message;
    if (message) return { message };
  }
  return { message: `Request failed with status ${status}` };
}

export function toErrorMessage(error: unknown, fallback: string): string {
  return error instanceof ApiError ? error.message : fallback;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = "GET", body, query, signal, auth = true } = options;

  const url = new URL(`${env.apiBaseUrl}${path}`);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined && value !== "")
      url.searchParams.set(key, String(value));
  }

  const token = auth ? readStoredToken() : null;

  let response: Response;
  try {
    response = await fetch(url, {
      method,
      signal,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new ApiError(
      "Network error. Check your connection and try again.",
      0,
    );
  }

  const payload =
    response.status === 204 ? null : await response.json().catch(() => null);

  if (!response.ok) {
    const { message, code } = readErrorMessage(payload, response.status);
    throw new ApiError(message, response.status, code);
  }

  return payload as T;
}
