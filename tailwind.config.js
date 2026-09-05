/** @type {import('tailwindcss').Config} */
module.exports = {
  // Drive the dark palette from a `dark` class on the root, which we
  // toggle from `app/_layout.tsx` via NativeWind's
  // `setColorScheme("system")`. Using `'class'` lets us drive the
  // theme from React state, and is the approach NativeWind 4
  // recommends for expo-router apps that need live theme switching.
  darkMode: "class",
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // All theme tokens expose a `DEFAULT` (light) and `dark` value.
      // NativeWind 4 resolves `bg-surface` to `surface.DEFAULT` and
      // `dark:bg-surface` to `surface.dark` based on the color scheme
      // set via `setColorScheme("system")`. So every component needs
      // the `dark:` variant to look right in dark mode — the cost of
      // a clean two-tone palette.
      colors: {
        // Brand accent — a deep champagne-gold that reads as premium
        // in both light and dark surfaces. The previous Spotify-green
        // accent was off-brand for a fashion/lifestyle app.
        primary: {
          DEFAULT: "#C9A227",
          dark: "#D4AF37",
        },
        // Text/icon color drawn on top of a `primary` fill.
        "on-primary": {
          DEFAULT: "#0A0A0F",
          dark: "#0A0B10",
        },
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#0B0B0F",
        },
        surface: {
          DEFAULT: "#F4F4F6",
          dark: "#1A1A20",
        },
        "surface-elevated": {
          DEFAULT: "#FFFFFF",
          dark: "#23232B",
        },
        border: {
          DEFAULT: "#E5E5EA",
          dark: "#2A2A33",
        },
        text: {
          primary: { DEFAULT: "#0A0A0F", dark: "#FAFAFA" },
          secondary: { DEFAULT: "#5A5A66", dark: "#A1A1AA" },
          tertiary: { DEFAULT: "#8A8A93", dark: "#71717A" },
        },
        input: {
          background: { DEFAULT: "#F4F4F6", dark: "#1A1A20" },
          border: { DEFAULT: "#E5E5EA", dark: "#2A2A33" },
          placeholder: { DEFAULT: "#8A8A93", dark: "#71717A" },
        },
        success: { DEFAULT: "#16A34A", dark: "#22C55E" },
        warning: { DEFAULT: "#D97706", dark: "#F59E0B" },
        danger: { DEFAULT: "#DC2626", dark: "#F87171" },
      },
    },
  },
  plugins: [],
};
