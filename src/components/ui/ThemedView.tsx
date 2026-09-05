import { View, ViewProps } from "react-native";

/**
 * `<View>` wrapper that maps a `variant` to one of the project's
 * surface tokens. Use when a `View` is rendered outside a screen
 * layout (inside modals, inside `<ScreenHeader>`, etc.).
 */
type Variant = "background" | "surface" | "card" | "elevated";

interface ThemedViewProps extends ViewProps {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  background: "bg-background dark:bg-background",
  surface: "bg-surface dark:bg-surface",
  card: "bg-surface dark:bg-surface",
  elevated: "bg-surface-elevated dark:bg-surface-elevated",
};

export const ThemedView = ({
  variant = "background",
  className = "",
  ...rest
}: ThemedViewProps) => {
  return (
    <View
      className={`${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    />
  );
};
