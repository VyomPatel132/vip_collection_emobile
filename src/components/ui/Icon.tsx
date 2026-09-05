import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * Themed wrapper around `Ionicons`. The `color` prop accepts either:
 *   - a semantic token: "primary" | "text" | "muted" | "onPrimary" |
 *     "danger" | "success" | "warning"
 *   - a raw color string (escape hatch for one-offs like the gold star)
 *   - omitted → "text"
 *
 * This is the single chokepoint for icon coloring — if a token needs
 * to change, it changes here and (separately) in `tailwind.config.js`.
 */

export type IconColor =
  | "primary"
  | "text"
  | "muted"
  | "onPrimary"
  | "danger"
  | "success"
  | "warning"
  | string;

type IoniconName = ComponentProps<typeof Ionicons>["name"];

interface IconProps {
  name: IoniconName;
  size?: number;
  color?: IconColor;
  className?: string;
  // Forwarded for any other Ionicons props (style, accessibilityLabel…).
  style?: ComponentProps<typeof Ionicons>["style"];
}

function resolveColor(
  color: IconColor | undefined,
  palette: ReturnType<typeof useThemeColor>["colors"],
): string {
  switch (color) {
    case undefined:
    case "text":
      return palette.text.primary;
    case "muted":
      return palette.text.tertiary;
    case "primary":
      return palette.primary;
    case "onPrimary":
      return palette.onPrimary;
    case "danger":
      // Read from the JS palette so it tracks the active scheme.
      return palette.danger;
    case "success":
      return palette.success;
    case "warning":
      return palette.warning;
    default:
      // Raw color string.
      return color;
  }
}

export const Icon = ({
  name,
  size = 22,
  color,
  className,
  style,
}: IconProps) => {
  const { colors } = useThemeColor();
  return (
    <Ionicons
      name={name}
      size={size}
      color={resolveColor(color, colors)}
      className={className}
      style={style}
    />
  );
};
