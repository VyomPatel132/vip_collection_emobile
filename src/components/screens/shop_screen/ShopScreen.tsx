import { ProductsGrid } from "@/components/custom";
import { Icon } from "@/components/ui";
import { useCategories, useProducts } from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Image } from "expo-image";
import React from "react";
import {
  Image as RNImage,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

// Fashion-shopping themed iconography. The bundled PNG assets are
// still the primary source of truth for known categories; this map
// covers the unknown/fallback case so the chip strip never looks
// broken. New entries are picked to feel like a wardrobe, not a
// generic grid.
const ICON_BY_NAME: Record<string, any> = {
  All: "grid-outline",
  Electronics: "phone-portrait-outline",
  Fashion: "shirt-outline",
  Sports: "football-outline",
  Books: "book-outline",
  Home: "home-outline",
};

// Map category name to the bundled PNG icon (if we have one) for
// visual continuity with the previous design. Categories that don't
// match a known entry fall back to a generic Ionicons glyph so the
// chip strip never looks broken.
//
// Bundled PNGs use the stock `react-native` `Image` rather than
// `expo-image`: `expo-image` with a number `require()` source has
// flaky NativeWind className application on Android, which left
// the chip blank even when the asset loaded successfully. RN's
// `Image` with an explicit `style={{ width, height }}` is the
// reliable path for bundled assets.
const IMAGE_BY_NAME: Record<string, any> = {
  Electronics: require("@/assets/images/electronics.png"),
  Fashion: require("@/assets/images/fashion.png"),
  Sports: require("@/assets/images/sports.png"),
  Books: require("@/assets/images/books.png"),
  Home: require("@/assets/images/home.png"),
};

export const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const { colors } = useThemeColor();

  const { data: products, isLoading, isError } = useProducts();
  const { data: categories } = useCategories();

  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    let filtered = products;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory,
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    return filtered;
  }, [products, selectedCategory, searchQuery]);

  return (
    <Animated.View entering={FadeIn.duration(400)} className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          entering={FadeInUp.duration(400)}
          className="px-6 pb-4 pt-6"
        >
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary dark:text-text-primary text-3xl font-bold tracking-tight">
                Shop
              </Text>
              <Text className="text-text-secondary dark:text-text-secondary text-sm mt-1">
                Browse all products
              </Text>
            </View>

            <TouchableOpacity
              className="bg-surface dark:bg-surface p-3 rounded-full"
              activeOpacity={0.7}
              onPress={() => {
                // Cycle through the available categories so the user
                // can change the filter from the top of the screen
                // without scrolling back to the chip strip.
                const list = categories?.length ? categories : null;
                if (!list) return;
                const idx = list.findIndex(
                  (c) => c.name === selectedCategory,
                );
                const next = list[(idx + 1) % list.length];
                setSelectedCategory(next.name);
              }}
            >
              <Icon name="filter-outline" size={22} color="text" />
            </TouchableOpacity>
          </View>

          <View className="bg-surface dark:bg-surface flex-row items-center px-5 py-2 rounded-2xl">
            <Icon name="search" size={22} color="muted" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor={colors.input.placeholder}
              className="flex-1 ml-3 text-base text-text-primary dark:text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </Animated.View>

        <View className="mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {(categories ?? []).map((category, idx) => {
              const isSelected = selectedCategory === category.name;
              const icon = ICON_BY_NAME[category.name];
              const image = IMAGE_BY_NAME[category.name];

              // Stagger each chip by 50ms so the strip "slides in"
              // rather than appearing all at once. Total stagger is
              // capped at ~400ms (8 chips) — long enough to feel
              // intentional, short enough not to slow the user down.
              return (
                <Animated.View
                  key={category.name}
                  entering={FadeInUp.delay(idx * 50).duration(300)}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedCategory(category.name)}
                    className={`mr-3 rounded-2xl size-20 overflow-hidden items-center justify-center ${
                      isSelected ? "bg-primary dark:bg-primary" : "bg-surface dark:bg-surface"
                    }`}
                  >
                    {image ? (
                      <RNImage
                        source={image}
                        style={{ width: 48, height: 48 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Icon
                        name={icon ?? "shirt-outline"}
                        size={36}
                        color={isSelected ? "onPrimary" : "text"}
                      />
                    )}
                  </TouchableOpacity>
                </Animated.View>
              );
            })}
          </ScrollView>
        </View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(400)}
          className="px-6 mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary dark:text-text-primary text-lg font-bold">
              Products
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary text-sm">
              {filteredProducts.length} items
            </Text>
          </View>

          <ProductsGrid
            products={filteredProducts}
            isLoading={isLoading}
            isError={isError}
          />
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
};
