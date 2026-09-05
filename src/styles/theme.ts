// Single source of truth for color tokens that can't be expressed as
// NativeWind classNames — Switch trackColor, BlurView tint, Tab bar
// props, etc. — and for the few raw color values that have to be
// passed as strings (ActivityIndicator, StatusBar).
//
// Keep this file in sync with `tailwind.config.js` so the same
// semantic token resolves to the same hex in both places.

export const Colors = {
  light: {
    background: "#FFFFFF",
    surface: "#F4F4F6",
    surfaceElevated: "#FFFFFF",
    border: "#E5E5EA",
    text: {
      primary: "#0A0A0F",
      secondary: "#5A5A66",
      tertiary: "#8A8A93",
    },
    primary: "#C9A227",
    // `onPrimary` is the text/icon color drawn on top of a `primary`
    // fill. In both modes we use a near-black so gold + black reads
    // like a luxury logo.
    onPrimary: "#0A0A0F",
    input: {
      background: "#F4F4F6",
      border: "#E5E5EA",
      placeholder: "#8A8A93",
    },
    blurTint: "light" as const,
    // "dark" status bar = dark text/icons on a light background.
    statusBarStyle: "dark" as const,
  },
  dark: {
    background: "#0B0B0F",
    surface: "#1A1A20",
    surfaceElevated: "#23232B",
    border: "#2A2A33",
    text: {
      primary: "#FAFAFA",
      secondary: "#A1A1AA",
      tertiary: "#71717A",
    },
    primary: "#D4AF37",
    onPrimary: "#0A0B10",
    input: {
      background: "#1A1A20",
      border: "#2A2A33",
      placeholder: "#71717A",
    },
    blurTint: "dark" as const,
    statusBarStyle: "light" as const,
  },
} as const;

export type ColorScheme = "light" | "dark";
export type ColorPalette = (typeof Colors)[ColorScheme];
