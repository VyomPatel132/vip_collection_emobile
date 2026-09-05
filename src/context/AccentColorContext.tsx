import * as SecureStore from "expo-secure-store";
import { vars } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useThemeContext, ON_PRIMARY_FOR_ACCENT } from "./ThemeContext";
import type { ColorScheme } from "@/styles/theme";

/**
 * Accent color override. When `null`, components fall back to the
 * NativeWind `primary` token (blue-500 in light, blue-400 in dark).
 * When set, the value here is the user-chosen brand accent.
 *
 * Persisted to `expo-secure-store` so the choice survives relaunch.
 * Gated by the `EXPO_PUBLIC_ENABLE_ACCENT_PICKER` env var — when
 * that flag is off, the picker UI is hidden in Settings and the
 * app uses the default `primary` token everywhere.
 *
 * At runtime, the provider broadcasts the choice into NativeWind's
 * CSS-variable table so every `bg-primary` / `text-primary` /
 * `border-primary` className picks up the new color without a
 * reload.
 */
const STORAGE_KEY = "vip.accentColor";

/** Preset palette exposed by the picker. Hex strings, no alpha. */
export const ACCENT_PRESETS: readonly string[] = [
  "#3B82F6", // blue-500 (default)
  "#06B6D4", // cyan-500
  "#8B5CF6", // violet-500
  "#EC4899", // pink-500
  "#10B981", // emerald-500
  "#F59E0B", // amber-500
  "#EF4444", // red-500
  "#1F2937", // near-black
] as const;

interface AccentColorContextValue {
  /** The user's chosen accent hex, or `null` to use the default. */
  accent: string | null;
  /** Persist + apply a new accent. Pass `null` to reset to default. */
  setAccent: (hex: string | null) => void;
  /**
   * The effective accent — either the user's choice or the active
   * theme's default `primary` token. Components that need a raw
   * color string should read from this.
   */
  effective: string;
  /** Whether the picker feature is enabled (env var). */
  enabled: boolean;
  /** Active color scheme so consumers can pair contrasts. */
  scheme: ColorScheme;
  /**
   * NativeWind `vars(...)` style object carrying the accent's
   * `--color-primary` + `--color-on-primary` overrides. Merged
   * into the root wrapper in `_layout.tsx` so the user's accent
   * wins over the theme's default for those two keys.
   */
  varsStyle: Record<string, unknown>;
}

const AccentColorContext = createContext<
  Omit<AccentColorContextValue, "effective" | "scheme" | "varsStyle"> | null
>(null);

const isHex = (s: string) => /^#[0-9A-Fa-f]{6}$/.test(s);

export const AccentColorProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const enabled = process.env.EXPO_PUBLIC_ENABLE_ACCENT_PICKER === "true";
  // We pull `scheme` + `colors` from ThemeContext so the accent's
  // `effective` value tracks both the user's choice and the active
  // theme. The provider sits *inside* ThemeProvider, so this hook
  // always has the latest resolved scheme.
  const { scheme, colors } = useThemeContext();

  const [accent, setAccentState] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(!enabled);

  // Only hydrate from disk if the feature is enabled. When the
  // feature is off, we never read or write the key — the picker
  // section is hidden in Settings.
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored && isHex(stored)) {
          setAccentState(stored);
        }
      })
      .catch(() => {
        // Best-effort.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const setAccent = useCallback(
    (hex: string | null) => {
      if (!enabled) return; // hard no-op when the feature is off
      setAccentState(hex);
      if (hex === null) {
        SecureStore.deleteItemAsync(STORAGE_KEY).catch(() => {});
      } else {
        SecureStore.setItemAsync(STORAGE_KEY, hex).catch(() => {});
      }
    },
    [enabled],
  );

  // The user's explicit accent OR the active theme's default.
  // `Colors[scheme].primary` is the right fallback for both modes.
  const effective = accent ?? colors.primary;

  // Build the NativeWind `vars(...)` style object for the accent.
  // Only two keys are overridden: `--color-primary` (the accent
  // itself) and `--color-on-primary` (the matching contrast).
  // The root layout merges this with the theme's varsStyle so the
  // accent always wins for these two keys.
  const varsStyle = useMemo(
    () =>
      vars({
        "--color-primary": effective,
        "--color-on-primary": ON_PRIMARY_FOR_ACCENT[scheme],
      }),
    [effective, scheme],
  );

  // The context only stores the raw user choice; `effective`,
  // `scheme`, and `varsStyle` are derived in `useAccentColor()` so
  // consumers can read them without re-subscribing to ThemeContext
  // separately.
  type StoredValue = Omit<
    AccentColorContextValue,
    "effective" | "scheme" | "varsStyle"
  >;
  const value = useMemo<StoredValue>(
    () => ({ accent, setAccent, enabled }),
    [accent, setAccent, enabled],
  );

  // Block the first render until hydration finishes, same gate as
  // `ThemeProvider` — prevents a flash of the default accent.
  if (!hydrated) return null;

  return (
    <AccentColorContext.Provider value={value}>
      {children}
    </AccentColorContext.Provider>
  );
};

export const useAccentColor = (): AccentColorContextValue => {
  const ctx = useContext(AccentColorContext);
  if (!ctx) {
    throw new Error(
      "useAccentColor must be used within <AccentColorProvider>",
    );
  }
  // `effective`, `scheme`, and `varsStyle` are derived from the
  // user's choice OR the active theme's `primary` token. Reading
  // from `useThemeContext()` here means the default accent
  // correctly tracks light/dark mode without the provider having
  // to know about the theme a second time.
  //
  // `varsStyle` only carries the accent's two override keys; the
  // root layout merges it with `useThemeContext().varsStyle` so
  // the accent wins for those two variables and the theme wins
  // for everything else.
  const { scheme, colors } = useThemeContext();
  const effective = ctx.accent ?? colors.primary;
  const varsStyle = useMemo(
    () =>
      vars({
        "--color-primary": effective,
        "--color-on-primary": ON_PRIMARY_FOR_ACCENT[scheme],
      }),
    [effective, scheme],
  );
  return { ...ctx, effective, scheme, varsStyle };
};
