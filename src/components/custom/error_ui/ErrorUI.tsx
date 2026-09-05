import { Icon } from "@/components/ui";
import { Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { SafeScreen } from "../safe_screen";

export const ErrorUI = () => {
  return (
    <SafeScreen>
      <Animated.View
        entering={FadeIn.duration(250)}
        className="flex-1 items-center justify-center px-6"
      >
        <Icon name="alert-circle-outline" size={64} color="danger" />
        <Text className="text-text-primary dark:text-text-primary font-semibold text-xl mt-4">
          Failed to load
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary text-center mt-2">
          Please check your connection and try again
        </Text>
      </Animated.View>
    </SafeScreen>
  );
};
