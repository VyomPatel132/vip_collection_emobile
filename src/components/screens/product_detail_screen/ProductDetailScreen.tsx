import { ErrorUI, LoadingUI, SafeScreen } from "@/components/custom";
import { BouncyButton, Icon } from "@/components/ui";
import { useCart, useProduct, useWishlist } from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatINR } from "@/lib/payment";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isError, isLoading } = useProduct(id);
  const { addToCart, isAddingToCart } = useCart();
  const { colors } = useThemeColor();

  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      { productId: product._id, quantity },
      {
        onSuccess: () =>
          Alert.alert("Success", `${product.name} added to cart!`),
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
  if (isError || !product) return <ErrorUI />;

  const inStock = product.stock > 0;

  return (
    <SafeScreen>
      {/* HEADER */}
      <View className="absolute top-0 left-0 right-0 z-10 px-6 pt-20 pb-4 flex-row items-center justify-between">
        <TouchableOpacity
          className="bg-black/50 backdrop-blur-xl w-12 h-12 rounded-full items-center justify-center"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Icon name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          className={`w-12 h-12 rounded-full items-center justify-center ${
            isInWishlist(product._id) ? "bg-primary dark:bg-primary" : "bg-black/50 backdrop-blur-xl"
          }`}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
          activeOpacity={0.7}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Icon
              name={isInWishlist(product._id) ? "heart" : "heart-outline"}
              size={24}
              // The heart is drawn over a colored circular backdrop
              // (gold when active, dark-translucent when inactive),
              // so the literal white/black here is intentional and
              // independent of the page theme.
              color={isInWishlist(product._id) ? colors.onPrimary : "#FFFFFF"}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* IMAGE GALLERY */}
        <Animated.View entering={FadeIn.duration(400)} className="relative">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
          >
            {product.images.map((image: string, index: number) => (
              <View key={index} style={{ width }}>
                <Image
                  source={image}
                  style={{ width, height: 400 }}
                  contentFit="cover"
                />
              </View>
            ))}
          </ScrollView>

          {/* Image Indicators */}
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-2">
            {product.images.map((_: any, index: number) => (
              <View
                key={index}
                className={`h-2 rounded-full ${
                  index === selectedImageIndex ? "bg-primary w-6" : "bg-white/50 w-2"
                }`}
              />
            ))}
          </View>
        </Animated.View>

        {/* PRODUCT INFO */}
        <Animated.View entering={FadeInUp.delay(80).duration(400)} className="p-6">
          {/* Category */}
          <View className="flex-row items-center mb-3">
            <View className="bg-primary/20 px-3 py-1 rounded-full">
              <Text className="text-primary dark:text-primary text-xs font-bold">
                {product.category}
              </Text>
            </View>
          </View>

          {/* Product Name */}
          <Text className="text-text-primary dark:text-text-primary text-3xl font-bold mb-3">
            {product.name}
          </Text>

          {/* Rating & Reviews */}
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center bg-surface dark:bg-surface px-3 py-2 rounded-full">
              {/* Star color is intentionally a literal — it reads as
                  "rating star" in both modes regardless of theme. */}
              <Icon name="star" size={16} color="#FFC107" />
              <Text className="text-text-primary dark:text-text-primary font-bold ml-1 mr-2">
                {product.averageRating.toFixed(1)}
              </Text>
              <Text className="text-text-secondary dark:text-text-secondary text-sm">
                ({product.totalReviews} reviews)
              </Text>
            </View>
            {inStock ? (
              <View className="ml-3 flex-row items-center">
                <View className="w-2 h-2 bg-success rounded-full mr-2" />
                <Text className="text-success dark:text-success font-semibold text-sm">
                  {product.stock} in stock
                </Text>
              </View>
            ) : (
              <View className="ml-3 flex-row items-center">
                <View className="w-2 h-2 bg-danger rounded-full mr-2" />
                <Text className="text-danger dark:text-danger font-semibold text-sm">
                  Out of Stock
                </Text>
              </View>
            )}
          </View>

          {/* Price */}
          <View className="flex-row items-center mb-6">
            <Text className="text-primary dark:text-primary text-4xl font-bold">
              {formatINR(product.price)}
            </Text>
          </View>

          {/* Quantity */}
          <View className="mb-6">
            <Text className="text-text-primary dark:text-text-primary text-lg font-bold mb-3">
              Quantity
            </Text>

            <View className="flex-row items-center">
              <BouncyButton
                className="bg-surface dark:bg-surface rounded-full w-12 h-12 items-center justify-center"
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!inStock}
              >
                <Icon
                  name="remove"
                  size={24}
                  color={inStock ? "text" : "muted"}
                />
              </BouncyButton>

              <Text className="text-text-primary dark:text-text-primary text-xl font-bold mx-6">
                {quantity}
              </Text>

              <BouncyButton
                className="bg-primary dark:bg-primary rounded-full w-12 h-12 items-center justify-center"
                onPress={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={!inStock || quantity >= product.stock}
              >
                <Icon
                  name="add"
                  size={24}
                  color={
                    !inStock || quantity >= product.stock ? "muted" : "onPrimary"
                  }
                />
              </BouncyButton>
            </View>

            {quantity >= product.stock && inStock && (
              <Text className="text-warning dark:text-warning text-sm mt-2">
                Maximum stock reached
              </Text>
            )}
          </View>

          {/* Description */}
          <View className="mb-8">
            <Text className="text-text-primary dark:text-text-primary text-lg font-bold mb-3">
              Description
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary text-base leading-6">
              {product.description}
            </Text>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View
        entering={FadeInUp.delay(150).duration(400)}
        className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-border dark:border-border px-6 py-4 pb-8"
      >
        <View className="flex-row items-center gap-3">
          <View className="flex-1">
            <Text className="text-text-secondary dark:text-text-secondary text-sm mb-1">
              Total Price
            </Text>
            <Text className="text-primary dark:text-primary text-2xl font-bold">
              {formatINR(product.price * quantity)}
            </Text>
          </View>
          <TouchableOpacity
            className={`rounded-2xl px-8 py-4 flex-row items-center ${
              !inStock ? "bg-surface dark:bg-surface" : "bg-primary dark:bg-primary"
            }`}
            activeOpacity={0.8}
            onPress={handleAddToCart}
            disabled={!inStock || isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <>
                <Icon
                  name="cart"
                  size={24}
                  color={!inStock ? "muted" : "onPrimary"}
                />
                <Text
                  className={`font-bold text-lg ml-2 ${
                    !inStock ? "text-text-secondary dark:text-text-secondary" : "text-on-primary dark:text-on-primary"
                  }`}
                >
                  {!inStock ? "Out of Stock" : "Add to Cart"}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeScreen>
  );
};
