import { SafeScreen } from "@/components";
import { useCart } from "@/hooks";
import { formatINR } from "@/lib/payment";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const Cart = () => {
  const { cart, isLoading, isError, cartTotal, cartItemCount, updateQuantity } =
    useCart();

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1db954" />
        </View>
      </SafeScreen>
    );
  }

  if (isError || !cart) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="text-text-primary text-xl font-bold">
            Cart unavailable
          </Text>
          <Text className="text-text-secondary mt-2 text-center">
            We couldn’t load your cart right now.
          </Text>
        </View>
      </SafeScreen>
    );
  }

  if (cart.items.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={80} color="#666" />
          <Text className="text-text-primary text-2xl font-bold mt-4">
            Your cart is empty
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add something you love to continue.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            onPress={() => router.push("/(tabs)")}
          >
            <Text className="text-background font-bold text-base">
              Browse Products
            </Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pb-28">
        <View className="flex-row items-center justify-between py-5">
          <Text className="text-text-primary text-3xl font-bold">Cart</Text>
          <Text className="text-text-secondary text-sm">
            {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 12 }}
        >
          {cart.items.map((item) => (
            <View
              key={item._id}
              className="bg-surface rounded-3xl p-3 mb-3 flex-row"
            >
              <Image
                source={item.product.images[0]}
                className="rounded-2xl bg-background-lighter"
                style={{ width: 88, height: 88, borderRadius: 12 }}
              />

              <View className="flex-1 ml-3 justify-between">
                <Text
                  className="text-text-primary font-bold text-base"
                  numberOfLines={2}
                >
                  {item.product.name}
                </Text>

                <Text className="text-primary font-bold text-lg mt-1">
                  {formatINR(item.product.price)}
                </Text>

                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center bg-background rounded-full px-2 py-1">
                    <TouchableOpacity
                      className="px-2 py-1"
                      onPress={() =>
                        updateQuantity({
                          productId: item.product._id,
                          quantity: Math.max(1, item.quantity - 1),
                        })
                      }
                    >
                      <Ionicons name="remove" size={16} color="#FFFFFF" />
                    </TouchableOpacity>

                    <Text className="text-text-primary min-w-[28px] text-center font-semibold">
                      {item.quantity}
                    </Text>

                    <TouchableOpacity
                      className="px-2 py-1"
                      onPress={() =>
                        updateQuantity({
                          productId: item.product._id,
                          quantity: item.quantity + 1,
                        })
                      }
                    >
                      <Ionicons name="add" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <Text className="text-text-secondary text-sm">
                    {formatINR(item.product.price * item.quantity)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-background px-5 pb-4 pt-3 border-t border-surface">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-secondary text-base">Subtotal</Text>
            <Text className="text-text-primary text-xl font-bold">
              {formatINR(cartTotal)}
            </Text>
          </View>

          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center"
            onPress={() => router.push("/(profile)/checkout")}
          >
            <Text className="text-background text-base font-bold">
              Proceed to Checkout
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};

export default Cart;
