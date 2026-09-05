import { Icon } from "@/components/ui/Icon";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { router } from "expo-router";
import { ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

/**
 * Reusable page header: a back button on the left, an optional title
 * in the center, and an optional `right` element on the right.
 *
 * Replaces the dozens of one-off "back arrow + title" blocks that
 * lived in Wishlist, Orders, OrderDetail, EditProfile,
 * ChangePassword, DeleteAccount, Notifications, ComingSoon,
 * PrivacySecurity, AddressesHeader, etc.
 *
 * The back button lives on its own non-animated row so the arrow
 * icon is never caught mid-fade with opacity 0 — a previous version
 * wrapped the whole row in FadeInDown and the icon could appear
 * invisible on the first frame of a screen mount. The header row
 * itself still gets a gentle FadeInDown.
 */
interface ScreenHeaderProps {
  title: string;
  /** Optional right-aligned slot (e.g. item count, action button). */
  right?: ReactNode;
  /** Show the back button. Defaults to true. */
  showBack?: boolean;
  /** Override the default back navigation. */
  onBack?: () => void;
  /** Border under the header — default true, set false for full-bleed headers. */
  bordered?: boolean;
  /** Show "chevron-back" instead of "arrow-back" (used by some screens). */
  variant?: "arrow" | "chevron";
}

export const ScreenHeader = ({
  title,
  right,
  showBack = true,
  onBack,
  bordered = true,
  variant = "arrow",
}: ScreenHeaderProps) => {
  const reduceMotion = useReducedMotion();
  const entering = reduceMotion ? undefined : FadeInDown.duration(280);

  const handleBack = () => {
    if (onBack) onBack();
    else router.back();
  };

  return (
    <Animated.View
      entering={entering}
      className={`px-6 pb-5 flex-row items-center min-h-[44px] ${
        bordered ? "border-b border-border dark:border-border" : ""
      }`}
    >
      {showBack && (
        <TouchableOpacity
          onPress={handleBack}
          // Surface-tinted pill so the touch target is always
          // visible against the page background in both light and
          // dark mode — the arrow icon was rendering against a
          // matching color on the home/profile routes and looked
          // missing.
          className="mr-3 -ml-2 p-2 rounded-full bg-surface-elevated dark:bg-surface-elevated"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Icon
            name={variant === "arrow" ? "arrow-back" : "chevron-back"}
            size={24}
            // `text` resolves to the theme's primary text color
            // (#0A0A0F in light, #FAFAFA in dark) — guaranteed
            // contrast against the surface-elevated pill.
            color="text"
          />
        </TouchableOpacity>
      )}
      <Text
        className="text-text-primary dark:text-text-primary text-2xl font-bold flex-shrink"
        numberOfLines={1}
      >
        {title}
      </Text>
      {right && (
        <View className="ml-auto flex-row items-center">{right}</View>
      )}
    </Animated.View>
  );
};
