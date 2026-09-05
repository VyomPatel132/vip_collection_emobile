import { Text, TextProps } from "react-native";

/**
 * Lightweight `<Text>` wrapper that maps a `variant` to the project's
 * typography scale. Use when a Text is rendered outside an existing
 * styled block (inside a Switch, inside an Alert, etc.). Inside
 * screens, prefer the `text-text-primary` / `text-text-secondary`
 * classNames directly so styling stays next to layout.
 */
type Variant =
  | "title" // page-level headings (e.g. "Cart")
  | "subtitle" // section subheading
  | "body" // default body
  | "caption" // small meta info (timestamps, counts)
  | "label"; // form labels above inputs

interface ThemedTextProps extends TextProps {
  variant?: Variant;
}

const VARIANT_CLASSES: Record<Variant, string> = {
  title: "text-text-primary dark:text-text-primary text-2xl font-bold",
  subtitle: "text-text-primary dark:text-text-primary text-lg font-semibold",
  body: "text-text-primary dark:text-text-primary text-base",
  caption: "text-text-secondary dark:text-text-secondary text-xs",
  label: "text-text-primary dark:text-text-primary text-sm font-semibold",
};

export const ThemedText = ({
  variant = "body",
  className = "",
  ...rest
}: ThemedTextProps) => {
  return (
    <Text
      className={`${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    />
  );
};
