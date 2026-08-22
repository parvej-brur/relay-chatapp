import { apiRequest } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/endpoints";
import type { User } from "@/types/user";

export const authKeys = {
  me: () => ["auth", "me"] as const,
};

export type LoginRequest = {
  phone: string;
  name: string;
};

export type LoginResponse = {
  token: string;
  user: User;
};

// There is no signup: an unknown phone number is registered, a known one is logged in.
export function login(body: LoginRequest) {
  return apiRequest<LoginResponse>(ENDPOINTS.login, { method: "POST", body, auth: false });
}

export function fetchCurrentUser() {
  return apiRequest<User>(ENDPOINTS.me);
}
