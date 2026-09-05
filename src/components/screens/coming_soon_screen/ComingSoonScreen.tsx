import { SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Lightweight "coming soon" placeholder. We use this for Account
// Activity, Connected Devices, Download Data, and any other Privacy /
// Security row that doesn't have a backend implementation yet. The
// title and description are pulled from the URL params so the screen
// can be reused without a per-route component.
export const ComingSoonScreen = () => {
  const { title = "Coming soon", description = "" } = useLocalSearchParams<{
    title?: string;
    description?: string;
  }>();

  return (
    <SafeScreen>
      <ScreenHeader title={title} />

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 24,
        }}
      >
        <Animated.View
          entering={FadeIn.duration(400)}
          className="items-center"
        >
          <View className="w-24 h-24 rounded-full bg-primary/15 items-center justify-center">
            <Icon name="construct-outline" size={48} color="primary" />
          </View>
          <Text className="text-text-primary dark:text-text-primary text-2xl font-bold mt-6 text-center">
            {title}
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary text-center mt-2 px-8">
            {description ||
              "This feature is on the way. Check back in a future release."}
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
};
