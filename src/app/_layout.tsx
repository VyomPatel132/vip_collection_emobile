import "@/styles/global.css";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import { useThemeColor } from "@/hooks/useThemeColor";

const queryClient = new QueryClient();

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  // NativeWind's `useColorScheme` powers the `dark:` variant on
  // classNames. We call `setColorScheme("system")` on mount so the
  // app follows the device's appearance — the spec is "auto-follow
  // the device theme" with no in-app toggle.
  const { setColorScheme } = useNativeWindColorScheme();

  // `useThemeColor` (which reads from `react-native`'s `useColorScheme`)
  // gives us the same scheme value for non-NativeWind callers —
  // `Switch trackColor`, `BlurView tint`, Tab bar props, etc. —
  // which can't accept classNames.
  const { scheme, colors } = useThemeColor();

  useEffect(() => {
    setColorScheme("system");
  }, [setColorScheme]);

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
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
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
        </SafeAreaProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
