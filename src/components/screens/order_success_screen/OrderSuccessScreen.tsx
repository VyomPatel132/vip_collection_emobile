import { SafeScreen } from "@/components/custom";
import { useUserOrder } from "@/hooks";
import { formatINR } from "@/lib/payment";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const OrderSuccessScreen = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { data: order, isLoading } = useUserOrder(id);

  return (
    <SafeScreen>
      <View className="flex-1 px-5">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 40,
            paddingBottom: 24,
            alignItems: "center",
          }}
        >
          <View className="w-24 h-24 rounded-full bg-primary/15 items-center justify-center">
            <Ionicons name="checkmark-circle" size={84} color="#1db954" />
          </View>

          <Text className="text-text-primary text-3xl font-extrabold mt-6 text-center">
            Payment Successful
          </Text>
          <Text className="text-text-secondary text-base mt-2 text-center px-6">
            Your order has been placed. We’ve sent a confirmation to your email.
          </Text>

          <View className="bg-surface rounded-3xl p-5 w-full mt-8">
            {isLoading ? (
              <ActivityIndicator size="small" color="#1db954" />
            ) : order ? (
              <>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-text-secondary text-sm">Order ID</Text>
                  <Text className="text-text-primary font-semibold">
                    #{order._id.slice(-8).toUpperCase()}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-text-secondary text-sm">Items</Text>
                  <Text className="text-text-primary font-semibold">
                    {order.orderItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0,
                    )}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-text-secondary text-sm">
                    Payment method
                  </Text>
                  <Text className="text-text-primary font-semibold capitalize">
                    {order.paymentMethod || "razorpay"}
                  </Text>
                </View>
                <View className="flex-row justify-between mb-3">
                  <Text className="text-text-secondary text-sm">
                    Payment status
                  </Text>
                  <Text className="text-primary font-semibold capitalize">
                    {order.paymentStatus}
                  </Text>
                </View>
                <View className="h-px bg-background-lighter my-2" />
                <View className="flex-row justify-between mt-1">
                  <Text className="text-text-primary text-lg font-bold">
                    Total paid
                  </Text>
                  <Text className="text-primary text-lg font-bold">
                    {formatINR(order.totalPrice)}
                  </Text>
                </View>
                {order.shippingAddress && (
                  <View className="mt-4">
                    <Text className="text-text-secondary text-sm mb-1">
                      Delivering to
                    </Text>
                    <Text className="text-text-primary font-semibold">
                      {order.shippingAddress.fullName}
                    </Text>
                    <Text className="text-text-secondary text-sm mt-0.5">
                      {order.shippingAddress.streetAddress}
                    </Text>
                    <Text className="text-text-secondary text-sm">
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state}{" "}
                      {order.shippingAddress.zipCode}
                    </Text>
                  </View>
                )}
              </>
            ) : (
              <Text className="text-text-secondary text-center">
                We couldn’t fetch the order details, but your payment was
                successful.
              </Text>
            )}
          </View>
        </ScrollView>

        <View className="px-1 pb-4">
          <TouchableOpacity
            onPress={() => router.replace("/(profile)/orders")}
            className="bg-primary rounded-2xl py-4 items-center mb-3"
            activeOpacity={0.85}
          >
            <Text className="text-background font-bold text-base">
              View My Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="bg-surface rounded-2xl py-4 items-center"
            activeOpacity={0.85}
          >
            <Text className="text-text-primary font-semibold text-base">
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeScreen>
  );
};
