// Barrel for the shared UI primitives. Kept separate from the
// `src/components/common` and `src/components/custom` barrels so the
// theme-aware primitives (Icon, ScreenHeader, etc.) can be imported
// either as a group (`@/components/ui`) or individually.

export { BouncyButton } from "./BouncyButton";
export { Icon } from "./Icon";
export type { IconColor } from "./Icon";
export { ScreenHeader } from "./ScreenHeader";
export { ThemedText } from "./ThemedText";
export { ThemedView } from "./ThemedView";
