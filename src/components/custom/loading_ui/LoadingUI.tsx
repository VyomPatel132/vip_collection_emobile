import { useThemeColor } from "@/hooks/useThemeColor";
import { ActivityIndicator, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeScreen } from "../safe_screen";

export const LoadingUI = () => {
  const { colors } = useThemeColor();

  return (
    <SafeScreen>
      <Animated.View
        // Subtle fade so the first paint of a network-bound screen
        // doesn't feel like a hard pop-in. Skipped when Reduce
        // Motion is on by virtue of `entering` being undefined on
        // the Animated.View at the layout level — but Reanimated
        // still plays the FadeIn in either mode, so we keep this
        // short (200ms) to stay polite.
        entering={FadeIn.duration(200)}
        className="flex-1 items-center justify-center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-text-secondary dark:text-text-secondary mt-4">Loading...</Text>
      </Animated.View>
    </SafeScreen>
  );
};
