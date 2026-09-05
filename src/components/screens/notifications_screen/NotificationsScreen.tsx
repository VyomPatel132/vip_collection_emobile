import { SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { ScrollView, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

// Placeholder for the in-app notifications list. The full
// implementation (order events, refund events, low-stock back-in-stock
// alerts) needs a `GET /api/notifications` endpoint which is part of
// Milestone E. Until that ships, we render a friendly empty state
// that tells the user nothing is wrong.
export const NotificationsScreen = () => {
  return (
    <SafeScreen>
      <ScreenHeader title="Notifications" />

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
            <Icon name="notifications-off-outline" size={48} color="primary" />
          </View>
          <Text className="text-text-primary dark:text-text-primary text-2xl font-bold mt-6 text-center">
            You're all caught up
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary text-center mt-2 px-8">
            Order updates, refund events, and back-in-stock alerts will
            appear here.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeScreen>
  );
};
