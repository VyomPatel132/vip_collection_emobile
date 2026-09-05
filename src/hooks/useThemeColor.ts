import { useThemeContext } from "@/context/ThemeContext";
import type { ColorPalette, ColorScheme } from "@/styles/theme";

/**
 * Returns the current color scheme (light/dark) and the matching
 * color palette. Components that can't use NativeWind classNames
 * (e.g. Switch, BlurView, Tab bar) read from the returned `colors`
 * object.
 *
 * The values now come from `ThemeContext` (which the user controls
 * via the Privacy & Security screen) rather than directly from
 * `useColorScheme()` — so a manual override applies to both
 * NativeWind's `dark:` class *and* the JS-side palette, keeping
 * the two halves in sync.
 *
 * Usage:
 *   const { scheme, colors } = useThemeColor();
 *   <Switch trackColor={{ true: colors.primary, false: colors.border }} />
 */
export function useThemeColor(): { scheme: ColorScheme; colors: ColorPalette } {
  const { scheme, colors } = useThemeContext();
  return { scheme, colors };
}
