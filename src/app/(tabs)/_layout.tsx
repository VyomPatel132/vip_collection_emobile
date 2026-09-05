import { Icon } from "@/components/ui";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@clerk/expo";
import { BlurView } from "expo-blur";
import { Redirect, Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";

const TabLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const { colors, scheme } = useThemeColor();

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)" />;

  // Use the current scheme's blur tint and brand colors so the tab
  // bar matches the active theme — including the live system-theme
  // switch.
  const blurTint = scheme === "dark" ? "dark" : "light";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: "transparent",
          borderTopWidth: 0,
          height: 32 + insets.bottom,
          paddingTop: 4,
          marginHorizontal: 100,
          marginBottom: insets.bottom,
          borderRadius: 24,
          overflow: "hidden",
        },
        tabBarBackground: () => (
          // Fade in the BlurView background on first mount so the
          // tab bar doesn't pop in instantly.
          <Animated.View
            entering={FadeIn.duration(500)}
            style={StyleSheet.absoluteFill}
          >
            <BlurView
              intensity={80}
              tint={blurTint}
              style={StyleSheet.absoluteFill}
              // StyleSheet.absoluteFill is equal to this 👇
              // { position: "absolute", top: 0, right: 0, left: 0, bottom: 0 }
            />
          </Animated.View>
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: 600,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Shop",
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="bag-handle-outline"
              size={size}
              color={color as string}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, size }) => (
            <Icon name="cart" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Icon
              name="person-circle-outline"
              size={size}
              color={color as string}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
