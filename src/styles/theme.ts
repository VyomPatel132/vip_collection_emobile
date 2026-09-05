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
    primary: "#3B82F6", // blue-500 — the default brand accent
    // `onPrimary` is the text/icon color drawn on top of a `primary`
    // fill. White reads as a clean contrast on the blue chip.
    onPrimary: "#FFFFFF",
    input: {
      background: "#F4F4F6",
      border: "#E5E5EA",
      placeholder: "#8A8A93",
    },
    blurTint: "light" as const,
    // "dark" status bar = dark text/icons on a light background.
    statusBarStyle: "dark" as const,
    // Status tokens — mirror the Tailwind config. Components that
    // need a raw color (Switch track, ActivityIndicator, BlurView
    // tint) read from here; everything else uses the CSS variable
    // via `bg-danger` / `text-danger` className.
    success: "#16A34A",
    warning: "#D97706",
    danger: "#DC2626",
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
    primary: "#60A5FA", // blue-400 — brighter for dark surfaces
    onPrimary: "#0A0A0F",
    input: {
      background: "#1A1A20",
      border: "#2A2A33",
      placeholder: "#71717A",
    },
    blurTint: "dark" as const,
    statusBarStyle: "light" as const,
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#F87171",
  },
} as const;

export type ColorScheme = "light" | "dark";
export type ColorPalette = (typeof Colors)[ColorScheme];
