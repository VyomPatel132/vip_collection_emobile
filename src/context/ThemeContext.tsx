import * as SecureStore from "expo-secure-store";
import { useColorScheme as useNativeWindColorScheme, vars } from "nativewind";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Appearance, useColorScheme } from "react-native";
// Deep import: `react-native-css-interop` exposes a `systemColorScheme`
// observable that drives the `dark:` variant. On React Native,
// `Appearance.setColorScheme` does NOT fire the native change event
// reliably, so the public `colorScheme.set` from `nativewind` ends up
// being a no-op for the `dark:` class. Setting the observable
// directly is the only reliable way to flip the dark palette at
// runtime on iOS/Android.
import { systemColorScheme } from "react-native-css-interop/dist/runtime/native/appearance-observables";
import { Colors, type ColorPalette, type ColorScheme } from "@/styles/theme";

/**
 * User-selectable theme mode.
 *   - "light"  → always light
 *   - "dark"   → always dark
 *   - "system" → follow OS appearance via `useColorScheme()`
 *
 * The exposed `scheme` is always "light" or "dark" — the resolved
 * value the rest of the app reads. `mode` is the user's choice.
 */
export type ThemeMode = "light" | "dark" | "system";
const STORAGE_KEY = "vip.themeMode";
const DEFAULT_MODE: ThemeMode = "system";

interface ThemeContextValue {
  /** The user's selected mode. */
  mode: ThemeMode;
  /** Persist + apply a new mode. */
  setMode: (mode: ThemeMode) => void;
  /** Resolved active scheme — always "light" or "dark". */
  scheme: ColorScheme;
  /** Palette matching the resolved scheme. */
  colors: ColorPalette;
  /**
   * NativeWind `vars(...)` style object carrying the resolved scheme's
   * CSS-variable values. Mounted as the `style` prop on a wrapper
   * `<View>` at the very top of the app (in `_layout.tsx`) so the
   * variables cascade to every NativeWind-styled child.
   *
   * This is the runtime replacement for the old `{ DEFAULT, dark }`
   * token shape — instead of a static `dark:bg-surface` variant, the
   * `bg-surface` className reads `var(--color-surface)` and the value
   * flips when this style object updates.
   */
  varsStyle: Record<string, unknown>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Variable values for each resolved scheme. The keys MUST match the
 * `--color-*` names declared in `src/styles/global.css` and
 * referenced from `tailwind.config.js`. The two `primary` /
 * `on-primary` entries are also rebroadcast by AccentColorProvider
 * on every accent change, so the accent always wins over the
 * theme's default.
 */
export const SCHEME_VARS: Record<ColorScheme, Record<string, string>> = {
  light: {
    "--color-primary": "#3B82F6",
    "--color-on-primary": "#FFFFFF",
    "--color-background": "#FFFFFF",
    "--color-surface": "#F4F4F6",
    "--color-surface-elevated": "#FFFFFF",
    "--color-border": "#E5E5EA",
    "--color-text-primary": "#0A0A0F",
    "--color-text-secondary": "#5A5A66",
    "--color-text-tertiary": "#8A8A93",
    "--color-input-background": "#F4F4F6",
    "--color-input-border": "#E5E5EA",
    "--color-input-placeholder": "#8A8A93",
    "--color-success": "#16A34A",
    "--color-warning": "#D97706",
    "--color-danger": "#DC2626",
  },
  dark: {
    "--color-primary": "#60A5FA",
    "--color-on-primary": "#0A0A0F",
    "--color-background": "#0B0B0F",
    "--color-surface": "#1A1A20",
    "--color-surface-elevated": "#23232B",
    "--color-border": "#2A2A33",
    "--color-text-primary": "#FAFAFA",
    "--color-text-secondary": "#A1A1AA",
    "--color-text-tertiary": "#71717A",
    "--color-input-background": "#1A1A20",
    "--color-input-border": "#2A2A33",
    "--color-input-placeholder": "#71717A",
    "--color-success": "#22C55E",
    "--color-warning": "#F59E0B",
    "--color-danger": "#F87171",
  },
};

/**
 * "On-primary" pair for a user-chosen accent. Kept here (not in
 * AccentColorContext) so both providers agree on the contrast rule.
 */
export const ON_PRIMARY_FOR_ACCENT: Record<ColorScheme, string> = {
  light: "#FFFFFF",
  dark: "#0A0A0F",
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // NativeWind's class strategy — drives the `dark:` variant on
  // every className. Subscribing also means NativeWind's internal
  // listener is active when we call `setColorScheme` below.
  const { setColorScheme: setNativeWindScheme } = useNativeWindColorScheme();
  // OS-level color scheme. `useColorScheme` from `react-native` is the
  // supported way to read the device's preferred appearance and it
  // fires when the user toggles the system theme.
  const systemScheme = useColorScheme();

  const [mode, setModeState] = useState<ThemeMode>(DEFAULT_MODE);
  const [hydrated, setHydrated] = useState(false);

  // Read the persisted mode on mount. If nothing is stored, we
  // stay on the default ("system"). The `finally` always flips
  // `hydrated`, so the rest of the tree is gated on a single read
  // regardless of whether the key existed.
  useEffect(() => {
    let cancelled = false;
    SecureStore.getItemAsync(STORAGE_KEY)
      .then((stored) => {
        if (cancelled) return;
        if (stored === "light" || stored === "dark" || stored === "system") {
          setModeState(stored);
        }
      })
      .catch(() => {
        // Best-effort. A failure to read means we keep the default.
      })
      .finally(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist on every change. Non-blocking — the UI updates first
  // and the write catches up. A failure here is non-fatal.
  const setMode = useCallback((next: ThemeMode) => {
    setModeState(next);
    SecureStore.setItemAsync(STORAGE_KEY, next).catch(() => {
      // Best-effort.
    });
  }, []);

  // Resolve the user's mode → active scheme. `system` falls back
  // to the OS appearance; if the OS hasn't reported one (Android
  // splash, or null on a few webview-driven layouts), treat as light.
  const scheme: ColorScheme = useMemo(() => {
    if (mode === "light") return "light";
    if (mode === "dark") return "dark";
    return systemScheme === "dark" ? "dark" : "light";
  }, [mode, systemScheme]);

  // Build the NativeWind `vars(...)` style object for the resolved
  // scheme. Stable across renders for the same scheme (the `vars`
  // call returns a fresh object each time but its opaque contents
  // are equivalent — React still re-renders descendants on scheme
  // change because the context value identity flips).
  const varsStyle = useMemo(
    () => vars(SCHEME_VARS[scheme] as Record<string, string>),
    [scheme],
  );

  // Drive the color scheme on every render where `scheme` changes.
  //
  // Three things have to move together for the whole app to flip:
  //   1. `Appearance.setColorScheme` (react-native) — so the OS-level
  //      `useColorScheme()` from `react-native` returns the right
  //      value. This also keeps StatusBar / SystemUI consumers
  //      that read from `react-native`'s hook happy.
  //   2. `setNativeWindScheme` from `nativewind` — calls
  //      `colorScheme.set` from `react-native-css-interop`, which
  //      on native delegates to `Appearance.setColorScheme`.
  //      Kept for completeness / future nativewind versions.
  //   3. `systemColorScheme.set` (react-native-css-interop deep
  //      import) — the `dark:` variant in every NativeWind
  //      className reads from this observable. On React Native,
  //      `Appearance.setColorScheme` does NOT fire the native
  //      change event reliably, so (1) and (2) above are
  //      effectively no-ops for the `dark:` class. Setting the
  //      observable directly is the only reliable way to flip
  //      the dark palette at runtime.
  //
  // The CSS-variable values themselves are broadcast by mounting
  // the `varsStyle` object (below in this context) on a wrapper
  // `<View>` in `_layout.tsx`. That's the cascade channel for
  // `bg-X`/`text-X` classNames that read `var(--color-…)`.
  useEffect(() => {
    Appearance.setColorScheme(scheme);
    setNativeWindScheme(scheme);
    systemColorScheme.set(scheme);
  }, [scheme, setNativeWindScheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, setMode, scheme, colors: Colors[scheme], varsStyle }),
    [mode, setMode, scheme, varsStyle],
  );

  // Block the first render of the entire tree until the persisted
  // mode is loaded. A ~5–30ms gate on a warm start — invisible to
  // the user — but it prevents a flash of the default theme when
  // the user has saved the opposite one.
  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useThemeContext must be used within <ThemeProvider>");
  }
  return ctx;
};
