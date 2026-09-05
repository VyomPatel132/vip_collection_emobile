import { ErrorUI, LoadingUI } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useCart, useWishlist } from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatINR } from "@/lib/payment";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export const WishlistScreen = () => {
  const {
    wishlist,
    isLoading,
    isError,
    removeFromWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const { addToCart, isAddingToCart } = useCart();
  const { colors } = useThemeColor();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert("Remove from wishlist", `Remove ${productName} from wishlist`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",

        onPress: () => removeFromWishlist(productId),
      },
    ]);
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () =>
          Alert.alert("Success", `${productName} added to cart!`),
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.error || "Failed to add to cart",
          );
        },
      },
    );
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;

  return (
    <>
      <ScreenHeader
        title="Wishlist"
        right={
          <Text className="text-text-secondary dark:text-text-secondary text-sm">
            {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
          </Text>
        }
      />

      {wishlist.length === 0 ? (
        <Animated.View
          entering={FadeIn.duration(400)}
          className="flex-1 items-center justify-center px-6"
        >
          <Icon name="heart-outline" size={80} color="muted" />
          <Text className="text-text-primary dark:text-text-primary font-semibold text-xl mt-4">
            Your wishlist is empty
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary text-center mt-2">
            Start adding products you love!
          </Text>
          <TouchableOpacity
            className="bg-primary dark:bg-primary rounded-2xl px-8 py-4 mt-6"
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-on-primary font-bold text-base">
              Browse Products
            </Text>
          </TouchableOpacity>
        </Animated.View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-4">
            {wishlist.map((item) => (
              <TouchableOpacity
                key={item._id}
                className="bg-surface dark:bg-surface rounded-3xl overflow-hidden mb-3"
                activeOpacity={0.8}
                onPress={() => router.push(`/product/${item._id}`)}
              >
                <View className="flex-row p-4">
                  <Image
                    source={item.images[0]}
                    className="rounded-2xl bg-surface-elevated dark:bg-surface-elevated"
                    style={{ width: 96, height: 96, borderRadius: 8 }}
                  />

                  <View className="flex-1 ml-4">
                    <Text
                      className="text-text-primary dark:text-text-primary font-bold text-base mb-2"
                      numberOfLines={2}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-primary dark:text-primary font-bold text-xl mb-2">
                      {formatINR(item.price)}
                    </Text>

                    {item.stock > 0 ? (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-success rounded-full mr-2" />
                        <Text className="text-success dark:text-success text-sm font-semibold">
                          {item.stock} in stock
                        </Text>
                      </View>
                    ) : (
                      <View className="flex-row items-center">
                        <View className="w-2 h-2 bg-danger rounded-full mr-2" />
                        <Text className="text-danger dark:text-danger text-sm font-semibold">
                          Out of Stock
                        </Text>
                      </View>
                    )}
                  </View>

                  <View onStartShouldSetResponder={() => true}>
                    <TouchableOpacity
                      className="self-start bg-danger/20 dark:bg-danger/20 p-2 rounded-full"
                      activeOpacity={0.7}
                      onPress={() =>
                        handleRemoveFromWishlist(item._id, item.name)
                      }
                      disabled={isRemovingFromWishlist}
                    >
                      <Icon name="trash-outline" size={20} color="danger" />
                    </TouchableOpacity>
                  </View>
                </View>
                {item.stock > 0 && (
                  <View className="px-4 pb-4">
                    <TouchableOpacity
                      className="bg-primary dark:bg-primary rounded-xl py-3 items-center"
                      activeOpacity={0.8}
                      onPress={() => handleAddToCart(item._id, item.name)}
                      disabled={isAddingToCart}
                    >
                      {isAddingToCart ? (
                        <ActivityIndicator size="small" color={colors.onPrimary} />
                      ) : (
                        <Text className="text-on-primary font-bold">
                          Add to Cart
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
};
