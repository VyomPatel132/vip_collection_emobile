import { BouncyButton, Icon } from "@/components/ui";
import { useCart, useWishlist } from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatINR } from "@/lib/payment";
import { Product } from "@/types";
import { router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  LinearTransition,
} from "react-native-reanimated";

interface ProductsGridProps {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
}

const NoProductsFound = () => {
  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      className="py-20 items-center justify-center"
    >
      <Icon name="search-outline" size={48} color="muted" />
      <Text className="text-text-primary dark:text-text-primary font-semibold mt-4">
        No products found
      </Text>
      <Text className="text-text-secondary dark:text-text-secondary text-sm mt-2">
        Try adjusting your filters
      </Text>
    </Animated.View>
  );
};

export const ProductsGrid = (props: ProductsGridProps) => {
  const { isLoading, isError, products } = props;
  const { colors } = useThemeColor();

  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const { isAddingToCart, addToCart } = useCart();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          Alert.alert("Success", `${productName} added to cart!`);
        },
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.error || "Failed to add to cart",
          );
        },
      },
    );
  };

  // Each card animates in with a small upward fade and a tiny stagger
  // based on its index. With ~8 products the total stagger is ~200ms
  // — enough to feel intentional, short enough not to slow the user.
  // `itemLayoutAnimation` on the list itself animates the *position*
  // of remaining items when one is removed (e.g. on filter change).
  const renderProduct = ({
    item: product,
    index,
  }: {
    item: Product;
    index: number;
  }) => (
    <Animated.View
      entering={FadeInUp.delay(index * 40).duration(350)}
      layout={LinearTransition.springify().damping(18)}
      style={{ width: "48%" }}
    >
      <BouncyButton
        className="bg-surface dark:bg-surface rounded-3xl overflow-hidden mb-3"
        activeOpacity={0.85}
        onPress={() => router.push(`/product/${product._id}`)}
      >
        <View className="relative">
          <Image
            source={{ uri: product.images[0] }}
            className="w-full h-44 bg-surface-elevated dark:bg-surface-elevated"
            resizeMode="cover"
          />

          <BouncyButton
            className="absolute top-3 right-3 bg-black/30 backdrop-blur-xl p-2 rounded-full"
            activeOpacity={0.7}
            onPress={() => toggleWishlist(product._id)}
            disabled={isAddingToWishlist || isRemovingFromWishlist}
          >
            {isAddingToWishlist || isRemovingFromWishlist ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Icon
                name={isInWishlist(product._id) ? "heart" : "heart-outline"}
                size={18}
                // The active wishlist heart uses a literal pink/red —
                // it reads as "loved" in both modes and is one of the
                // intentional color escapes we keep in this file.
                color={isInWishlist(product._id) ? "#FF4D6D" : "#FFFFFF"}
              />
            )}
          </BouncyButton>
        </View>

        <View className="p-3">
          <Text className="text-text-secondary dark:text-text-secondary text-xs mb-1">
            {product.category}
          </Text>
          <Text
            className="text-text-primary dark:text-text-primary font-bold text-sm mb-2"
            numberOfLines={2}
          >
            {product.name}
          </Text>

          <View className="flex-row items-center mb-2">
            {/* Star color is intentionally a literal — it reads as
                "rating star" in both modes regardless of theme. */}
            <Icon name="star" size={12} color="#FFC107" />
            <Text className="text-text-primary dark:text-text-primary text-xs font-semibold ml-1">
              {product.averageRating.toFixed(1)}
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary text-xs ml-1">
              ({product.totalReviews})
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <Text className="text-primary dark:text-primary font-bold text-lg">
              {formatINR(product.price)}
            </Text>

            <BouncyButton
              className="bg-primary dark:bg-primary rounded-full w-8 h-8 items-center justify-center"
              activeOpacity={0.7}
              onPress={() => handleAddToCart(product._id, product.name)}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <ActivityIndicator size="small" color={colors.onPrimary} />
              ) : (
                <Icon name="add" size={18} color="onPrimary" />
              )}
            </BouncyButton>
          </View>
        </View>
      </BouncyButton>
    </Animated.View>
  );

  if (isLoading) {
    return (
      <Animated.View
        entering={FadeInUp.duration(300)}
        className="py-20 items-center justify-center"
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-text-secondary dark:text-text-secondary mt-4">Loading products...</Text>
      </Animated.View>
    );
  }

  if (isError) {
    return (
      <Animated.View
        entering={FadeInUp.duration(300)}
        className="py-20 items-center justify-center"
      >
        <Icon name="alert-circle-outline" size={48} color="danger" />
        <Text className="text-text-primary dark:text-text-primary font-semibold mt-4">
          Failed to load products
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary text-sm mt-2">
          Please try again later
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.FlatList
      data={products}
      renderItem={renderProduct}
      keyExtractor={(item) => item._id}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: "space-between" }}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      ListEmptyComponent={NoProductsFound}
      itemLayoutAnimation={LinearTransition.springify().damping(18)}
    />
  );
};
