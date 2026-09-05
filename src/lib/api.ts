import { useAuth } from "@clerk/expo";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL!;

if (!API_URL) {
  // Fail loudly on startup rather than at request time. Without a base
  // URL every API call would 404 silently. See docs/operations.md.
  throw new Error(
    "EXPO_PUBLIC_API_URL is not set. Add it to your .env / .env.local and restart Expo.",
  );
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor (Clerk bearer token)
// ---------------------------------------------------------------------------
//
// The interceptor is installed **once** at module load, not inside
// `useApi()`. The previous implementation re-installed an interceptor on
// every render of every screen that called `useApi()`, which leaked
// closures holding stale `getToken` references. With multiple interceptors
// stacked, a token refresh from one screen could clobber the auth header
// of a request fired from another screen — a frequent source of
// intermittent 401s on cart / checkout.
//
// We capture the latest `getToken` via a holder that the auth-aware hook
// (`useApi`) updates on every render, so a fresh token is always used
// without re-registering the interceptor.
let getTokenHolder: (() => Promise<string | null>) | null = null;

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  if (!getTokenHolder) return config;

  try {
    const token = await getTokenHolder();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
  } catch (err) {
    // If the token fetch throws, let the request go out without a token;
    // the server will respond 401 and the response interceptor below will
    // route us to the auth screen.
    console.warn("[api] failed to attach Clerk token", err);
  }

  return config;
});

// ---------------------------------------------------------------------------
// Response interceptor (401 redirect to /auth, 403 toast hook)
// ---------------------------------------------------------------------------
//
// Mobile axios has no built-in toast, so 403s are surfaced via console
// only — the mobile screens handle their own error states. 401s redirect
// to the auth screen, which the ClerkProvider will recognize as signed-
// out. A redirector holder is used (same pattern as the request side) so
// the singleton interceptor can be installed at module load and still
// navigate via the current `expo-router` instance.
let onUnauthorized: (() => void) | null = null;
let onForbidden: ((message?: string) => void) | null = null;

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401) {
      onUnauthorized?.();
    } else if (status === 403) {
      onForbidden?.((error.response?.data as any)?.message);
    }
    return Promise.reject(error);
  },
);

export const useApi = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Refresh the holders on every render so the singleton interceptor
    // always uses the *current* Clerk `getToken` and the *current* router.
    getTokenHolder = getToken;
    onUnauthorized = () => router.replace("/(auth)");
    onForbidden = (message) => {
      // No toast lib on mobile today — surface via console. Future work
      // can wire this into a global toast provider.
      console.warn("[api] 403 forbidden", message);
    };

    return () => {
      // Clear holders on unmount; do **not** eject the singleton
      // interceptor (that would happen on every navigation, defeating
      // the purpose of installing it once).
      if (getTokenHolder === getToken) getTokenHolder = null;
      if (onUnauthorized) onUnauthorized = null;
      if (onForbidden) onForbidden = null;
    };
  }, [getToken, router]);

  return api;
};
