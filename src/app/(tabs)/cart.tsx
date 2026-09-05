import { SafeScreen } from "@/components";
import { BouncyButton, Icon } from "@/components/ui";
import { useCart } from "@/hooks";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeInUp,
  LinearTransition,
} from "react-native-reanimated";

const TAB_BAR_HEIGHT = 32; // matches the value set in (tabs)/_layout.tsx
// Breathing room between the bottom of the CTA and the top of the
// floating tab bar. 28dp reads as a clear visual gap on the cart
// screen where the CTA is full-width and otherwise feels glued to
// the tab bar pill.
const CTA_VISUAL_GAP = 28;

const Cart = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useThemeColor();
  const {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    updateQuantity,
    removeFromCart,
    isRemoving,
  } = useCart();

  // Total vertical space reserved at the bottom of the screen for the
  // floating tab bar (positioned absolute at `bottom: insets.bottom`)
  // and the visual gap below our CTA.
  const tabBarClearance = insets.bottom + TAB_BAR_HEIGHT + CTA_VISUAL_GAP;

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (isError || !cart) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-text-primary dark:text-text-primary text-xl font-bold">
            Cart unavailable
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary mt-2 text-center">
            We couldn’t load your cart right now.
          </Text>
        </View>
      </SafeScreen>
    );
  }

  if (cart.items.length === 0) {
    return (
      <SafeScreen>
        <Animated.View
          entering={FadeIn.duration(400)}
          className="flex-1 items-center justify-center px-6"
        >
          <Icon name="bag-handle-outline" size={80} color="muted" />
          {/* `numberOfLines={1}` keeps the heading on a single line
              so the block reads as a unit. `adjustsFontSizeToFit`
              shrinks the font on very narrow devices rather than
              wrapping or truncating with an ellipsis. */}
          <Text
            className="text-text-primary dark:text-text-primary text-2xl font-bold mt-4 text-center"
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            Your cart is empty
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary text-center mt-2">
            Add something you love to continue.
          </Text>
          <TouchableOpacity
            className="bg-primary dark:bg-primary rounded-2xl px-8 py-4 mt-6"
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-on-primary dark:text-on-primary font-bold text-base">
              Browse Products
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeScreen>
    );
  }

  const handleRemove = (item: any) => {
    Alert.alert(
      "Remove from cart?",
      `${item.product.name} will be removed from your cart.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromCart(item.product._id),
        },
      ],
    );
  };

  return (
    <SafeScreen>
      <Animated.View
        entering={FadeIn.duration(400)}
        className="flex-1 px-5"
        style={{ paddingBottom: tabBarClearance + 120 }}
      >
        <Animated.View
          entering={FadeInUp.duration(400)}
          className="flex-row items-center justify-between py-5"
        >
          <Text className="text-text-primary dark:text-text-primary text-3xl font-bold">Cart</Text>
          <Text className="text-text-secondary dark:text-text-secondary text-sm">
            {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
          </Text>
        </Animated.View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        >
          {cart.items.map((item, idx) => (
            <Animated.View
              key={item._id}
              entering={FadeInUp.delay(idx * 60).duration(350)}
              // Animates the row's position when the list changes
              // (item removed, quantity changed so the row resizes).
              layout={LinearTransition.springify().damping(18)}
              className="bg-surface dark:bg-surface rounded-3xl p-3 mb-3 flex-row"
            >
              <Image
                source={item.product.images[0]}
                className="rounded-2xl bg-surface-elevated dark:bg-surface-elevated"
                style={{ width: 88, height: 88, borderRadius: 12 }}
              />

              <View className="flex-1 ml-3 justify-between">
                <View className="flex-row items-start justify-between">
                  <Text
                    className="text-text-primary dark:text-text-primary font-bold text-base flex-1 pr-2"
                    numberOfLines={2}
                  >
                    {item.product.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleRemove(item)}
                    disabled={isRemoving}
                    className="px-1 -mt-1 -mr-1"
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Icon name="trash-outline" size={18} color="danger" />
                  </TouchableOpacity>
                </View>

                <Text className="text-primary dark:text-primary font-bold text-lg mt-1">
                  {formatINR(item.product.price)}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center bg-background dark:bg-background rounded-full px-2 py-1">
                    <BouncyButton
                      className="px-2 py-1"
                      onPress={() =>
                        updateQuantity({
                          productId: item.product._id,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                    >
                      <Icon name="remove" size={16} color="text" />
                    </BouncyButton>

                    <Text className="text-text-primary dark:text-text-primary min-w-[28px] text-center font-semibold">
                      {item.quantity}
                    </Text>

                    <BouncyButton
                      className="px-2 py-1"
                      onPress={() =>
                        updateQuantity({
                          productId: item.product._id,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      <Icon name="add" size={16} color="text" />
                    </BouncyButton>
                  </View>

                  <Text className="text-text-secondary dark:text-text-secondary text-sm">
                    {formatINR(item.product.price * item.quantity)}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.delay(150).duration(400)}
        className="absolute left-0 right-0 bg-background dark:bg-background px-5 pt-3 border-t border-border dark:border-border"
        style={{ bottom: tabBarClearance }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-text-secondary dark:text-text-secondary text-base">Subtotal</Text>
          <Text className="text-text-primary dark:text-text-primary text-xl font-bold">
            {formatINR(cartTotal)}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-primary dark:bg-primary rounded-2xl py-4 items-center"
          onPress={() => router.push("/(profile)/checkout")}
        >
          <Text className="text-on-primary dark:text-on-primary text-base font-bold">
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeScreen>
  );
};

export default Cart;
