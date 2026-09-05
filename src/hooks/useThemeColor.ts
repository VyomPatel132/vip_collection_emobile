import { useColorScheme } from "react-native";
import { ColorPalette, ColorScheme, Colors } from "@/styles/theme";

/**
 * Returns the current color scheme (light/dark) and the matching
 * color palette. Components that can't use NativeWind classNames
 * (e.g. Switch, BlurView, Tab bar) read from the returned `colors`
 * object.
 *
 * Usage:
 *   const { scheme, colors } = useThemeColor();
 *   <Switch trackColor={{ true: colors.primary, false: colors.border }} />
 */
export function useThemeColor(): { scheme: ColorScheme; colors: ColorPalette } {
  const scheme = (useColorScheme() ?? "light") as ColorScheme;
  return { scheme, colors: Colors[scheme] };
}
