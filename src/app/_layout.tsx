import "@/styles/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  AccentColorProvider,
  useAccentColor,
} from "@/context/AccentColorContext";
import { ThemeProvider, useThemeContext } from "@/context/ThemeContext";
import { useThemeColor } from "@/hooks/useThemeColor";

const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

/**
 * The vars-style wrapper. Lives at the very top of the React tree
 * (under the providers, above the Stack) so the CSS-variable
 * cascade reaches every NativeWind-styled child.
 *
 * `varsStyle` from ThemeContext carries every `--color-*` value
 * for the resolved scheme. The AccentColorProvider's `varsStyle`
 * carries two override keys (`--color-primary` + `--color-on-primary`).
 * The accent provider mounts inside the theme provider, so its
 * `varsStyle` is read here last and wins for the two accent keys.
 *
 * `style={[a, b]}` works because both objects are NativeWind
 * `vars(...)` opaque styles — they don't conflict, they merge at
 * the variable-resolution layer.
 *
 * `flex: 1` is required: without it the wrapper has no intrinsic
 * size and React Native clips its children to a 0×0 box — the
 * Stack inside gets no room, every screen renders blank, and the
 * user sees only a black (background) status bar.
 */
function VarsRoot({ children }: { children: React.ReactNode }) {
  const { varsStyle: themeVars } = useThemeContext();
  const { varsStyle: accentVars } = useAccentColor();
  return (
    <View style={[{ flex: 1 }, themeVars, accentVars]} collapsable={false}>
      {children}
    </View>
  );
}

/**
 * Lives INSIDE <ThemeProvider> so it can read the user-controlled
 * palette via `useThemeColor()`. It owns the runtime side-effects
 * that depend on the resolved scheme (native background, status-bar
 * style, web `<html class="dark">`) plus the themed <Stack> options.
 *
 * Splitting this out of `RootLayout` is the whole point: the
 * provider must wrap the component that calls `useThemeColor()`,
 * and we don't want the root layout itself to be the one that
 * consumes the context (it sits above the provider in the tree).
 */
function ThemedRoot() {
  // `useThemeColor` reads from `ThemeContext` (the user-controlled
  // light/dark override). The context drives both NativeWind's
  // `dark:` class *and* this JS-side palette, so the two halves
  // stay in sync without us calling `setColorScheme` here.
  const { scheme, colors } = useThemeColor();

  // Imperatively set the native root view background so the brief
  // moment before React paints isn't a white (or black) flash on the
  // wrong-themed device. Without this, devices that boot to dark
  // mode see a white flash before our dark background applies.
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch(() => {
      // Best-effort; some platforms don't support it.
    });
  }, [colors.background]);

  // Also flip the web root's `dark` class so the web build of the
  // app (if anyone runs it) honors the same toggle. No-op on
  // iOS/Android.
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", scheme === "dark");
    }
  }, [scheme]);

  return (
    <>
      <StatusBar style={colors.statusBarStyle} />
      <Stack
        screenOptions={{
          headerShown: false,
          // Slide-from-right is the native iOS default. Setting
          // it here makes the Android stack feel consistent and
          // makes modal pushes feel like a navigation gesture
          // rather than a hard cut.
          animation: "slide_from_right",
          animationDuration: 220,
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </>
  );
}

/**
 * `<View style={[varsStyle]}>` *replaces* its descendants' variable
 * scope, so the wrapper is the parent of <ThemedRoot/>. We compose
 * them inline here so the tree stays one layer deep.
 */
function RootShell() {
  return (
    <VarsRoot>
      <ThemedRoot />
    </VarsRoot>
  );
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <AccentColorProvider>
            <SafeAreaProvider>
              <RootShell />
            </SafeAreaProvider>
          </AccentColorProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
