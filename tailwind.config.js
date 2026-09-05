/** @type {import('tailwindcss').Config} */
module.exports = {
  // Drive the dark palette from a `dark` class on the root, which we
  // toggle from `app/_layout.tsx` via NativeWind's `setColorScheme`.
  // Using `'class'` lets us drive the theme from React state, and is
  // the approach NativeWind 4 recommends for expo-router apps that
  // need live theme switching.
  darkMode: "class",
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // Every color resolves to a CSS variable. The variable values
      // are defined in `src/styles/global.css` and overridden at
      // runtime by:
      //   - `ThemeProvider`       → flips light/dark CSS variables
      //   - `AccentColorProvider` → flips --color-primary + --color-on-primary
      // The trailing hex in `var(--name, #hex)` is the compile-time
      // fallback that Tailwind needs to validate the color, and that
      // NativeWind renders before the runtime value lands. It falls
      // back to the light value so first paint never flashes dark on
      // a light-mode device.
      //
      // Why CSS variables (and not `bg-X dark:bg-X`)? In NativeWind 4
      // the `dark:` variant only gates WHEN a rule applies — it does
      // NOT swap the value. With the old `{ DEFAULT, dark }` shape,
      // `bg-surface dark:bg-surface` resolved to `surface.DEFAULT`
      // (`#F4F4F6`) in both modes, so dark mode never actually
      // rendered dark. With `var(--color-surface)`, the variable
      // itself flips and every consumer follows.
      colors: {
        primary: "var(--color-primary, #3B82F6)",
        "on-primary": "var(--color-on-primary, #FFFFFF)",
        background: "var(--color-background, #FFFFFF)",
        surface: "var(--color-surface, #F4F4F6)",
        "surface-elevated": "var(--color-surface-elevated, #FFFFFF)",
        border: "var(--color-border, #E5E5EA)",
        text: {
          primary: "var(--color-text-primary, #0A0A0F)",
          secondary: "var(--color-text-secondary, #5A5A66)",
          tertiary: "var(--color-text-tertiary, #8A8A93)",
        },
        input: {
          background: "var(--color-input-background, #F4F4F6)",
          border: "var(--color-input-border, #E5E5EA)",
          placeholder: "var(--color-input-placeholder, #8A8A93)",
        },
        success: "var(--color-success, #16A34A)",
        warning: "var(--color-warning, #D97706)",
        danger: "var(--color-danger, #DC2626)",
      },
    },
  },
  plugins: [],
};
