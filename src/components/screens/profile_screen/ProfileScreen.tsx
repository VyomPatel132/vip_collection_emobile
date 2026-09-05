import { Icon } from "@/components/ui";
import { useAuth, useUser } from "@clerk/expo";
import { ACCENT_PRESETS } from "@/context/AccentColorContext";
import { Image } from "expo-image";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

// Each menu card has a *tinted* icon-and-circle pair — a fashion-shop
// app shouldn't feel like a system settings page. The accent color
// for each card is looked up from `ACCENT_PRESETS` so the swatches
// can never drift from the picker.
//
//   0: blue (default brand)
//   1: cyan
//   2: violet
//   3: pink
//   4: emerald
//   5: amber
//   6: red
//   7: near-black
const MENU_ITEMS = [
  {
    id: 1,
    icon: "person-outline" as const,
    title: "Edit Profile",
    accentIndex: 0, // blue
    action: "/(profile)/edit-profile",
  },
  {
    id: 2,
    icon: "receipt-outline" as const, // "receipt" reads as orders
    title: "Orders",
    accentIndex: 4, // emerald
    action: "/(profile)/orders",
  },
  {
    id: 3,
    icon: "location-outline" as const,
    title: "Addresses",
    accentIndex: 5, // amber
    action: "/(profile)/addresses",
  },
  {
    id: 4,
    icon: "heart-outline" as const,
    title: "Wishlist",
    accentIndex: 6, // red
    action: "/(profile)/wishlist",
  },
] as const;

export const ProfileScreen = () => {
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleMenuPress = (action: (typeof MENU_ITEMS)[number]["action"]) => {
    router.push(action as any);
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} className="flex-1">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Animated.View
          entering={FadeInUp.duration(400)}
          className="px-6 pb-8"
        >
          <View className="bg-surface dark:bg-surface rounded-3xl p-6">
            <View className="flex-row items-center">
              <View className="relative">
                <Image
                  source={user?.imageUrl}
                  style={{ width: 80, height: 80, borderRadius: 40 }}
                  transition={200}
                />
                <View className="absolute -bottom-1 -right-1 bg-primary dark:bg-primary rounded-full size-7 items-center justify-center border-2 border-border dark:border-border">
                  <Icon name="checkmark" size={16} color="onPrimary" />
                </View>
              </View>

              <View className="flex-1 ml-4">
                <Text className="text-text-primary dark:text-text-primary text-2xl font-bold mb-1">
                  {user?.firstName} {user?.lastName}
                </Text>
                <Text className="text-text-secondary dark:text-text-secondary text-sm">
                  {user?.emailAddresses?.[0]?.emailAddress || "No email"}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View className="flex-row flex-wrap gap-2 mx-6 mb-8">
          {MENU_ITEMS.map((item, idx) => {
            const color = ACCENT_PRESETS[item.accentIndex];
            return (
              <Animated.View
                key={item.id}
                entering={FadeInUp.delay(idx * 60).duration(350)}
                style={{ width: "48%" }}
              >
                <TouchableOpacity
                  className="bg-surface dark:bg-surface rounded-2xl p-6 items-center justify-center"
                  activeOpacity={0.7}
                  onPress={() => handleMenuPress(item.action)}
                >
                  <View
                    className="rounded-full w-16 h-16 items-center justify-center mb-4"
                    style={{ backgroundColor: color + "20" }}
                  >
                    <Icon name={item.icon} size={28} color={color} />
                  </View>
                  <Text className="text-text-primary dark:text-text-primary font-bold text-base">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>

        <Animated.View
          entering={FadeInUp.delay(250).duration(400)}
          className="mb-8 mx-6 bg-surface dark:bg-surface rounded-2xl p-4"
        >
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/(profile)/notifications" as any)}
          >
            <View className="flex-row items-center">
              <Icon
                name="notifications-outline"
                size={22}
                color="text"
              />
              <Text className="text-text-primary dark:text-text-primary font-semibold ml-3">
                Notifications
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="muted" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(300).duration(400)}
          className="mb-8 mx-6 bg-surface dark:bg-surface rounded-2xl p-4"
        >
          <TouchableOpacity
            className="flex-row items-center justify-between py-2"
            activeOpacity={0.7}
            onPress={() => router.push("/privacy-security")}
          >
            <View className="flex-row items-center">
              <Icon
                name="shield-checkmark-outline"
                size={22}
                color="text"
              />
              <Text className="text-text-primary dark:text-text-primary font-semibold ml-3">
                Privacy & Security
              </Text>
            </View>
            <Icon name="chevron-forward" size={20} color="muted" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(350).duration(400)}>
          <TouchableOpacity
            className="mx-6 mb-3 bg-surface dark:bg-surface rounded-2xl py-5 flex-row items-center justify-center border-2 border-danger/20"
            activeOpacity={0.8}
            onPress={() => signOut()}
          >
            <Icon name="log-out-outline" size={22} color="danger" />
            <Text className="text-danger font-bold text-base ml-2">
              Sign Out
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text className="mx-6 mb-3 text-center text-text-secondary dark:text-text-secondary text-xs">
          Version 1.0.0
        </Text>
      </ScrollView>
    </Animated.View>
  );
};
