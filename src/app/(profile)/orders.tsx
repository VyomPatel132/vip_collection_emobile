import { SafeScreen } from "@/components/custom";
import { useUserOrders } from "@/hooks";
import { formatINR } from "@/lib/payment";
import { Order } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const getStatusBadge = (status: Order["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-primary/20 text-primary";
    case "shipped":
      return "bg-blue-500/20 text-blue-400";
    case "delivered":
      return "bg-green-500/20 text-green-400";
    case "cancelled":
      return "bg-red-500/20 text-red-400";
    case "pending":
    default:
      return "bg-yellow-500/20 text-yellow-400";
  }
};

const getPaymentStatusBadge = (status: Order["paymentStatus"]) => {
  switch (status) {
    case "paid":
      return "bg-green-500/20 text-green-400";
    case "failed":
      return "bg-red-500/20 text-red-400";
    case "refunded":
      return "bg-gray-500/30 text-gray-300";
    case "pending":
    default:
      return "bg-yellow-500/20 text-yellow-400";
  }
};

const Orders = () => {
  const router = useRouter();
  const { data: orders, isLoading, isError, refetch } = useUserOrders();

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1db954" />
        </View>
      </SafeScreen>
    );
  }

  if (isError) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={80} color="#666" />
          <Text className="text-text-primary text-xl font-bold mt-4">
            Couldn’t load orders
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-primary rounded-2xl px-8 py-3 mt-6"
          >
            <Text className="text-background font-semibold">Try again</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="receipt-outline" size={80} color="#666" />
          <Text className="text-text-primary text-2xl font-bold mt-4">
            No orders yet
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Your placed orders will appear here.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
          >
            <Text className="text-background font-bold text-base">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pb-6">
        <View className="py-5">
          <Text className="text-text-primary text-3xl font-bold">
            My Orders
          </Text>
          <Text className="text-text-secondary text-sm mt-1">
            {orders.length} {orders.length === 1 ? "order" : "orders"}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {orders.map((order) => {
            const itemCount = order.orderItems.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            const firstItem = order.orderItems[0];
            return (
              <TouchableOpacity
                key={order._id}
                activeOpacity={0.85}
                onPress={() =>
                  router.push(
                    `/(profile)/order-success?id=${order._id}` as any,
                  )
                }
                className="bg-surface rounded-3xl p-4 mb-4"
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-text-primary font-bold">
                    #{order._id.slice(-8).toUpperCase()}
                  </Text>
                  <Text className="text-text-secondary text-xs">
                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                <View className="flex-row items-center">
                  {firstItem && (
                    <Image
                      source={firstItem.image}
                      style={{ width: 56, height: 56, borderRadius: 10 }}
                      className="bg-background-lighter"
                    />
                  )}
                  <View className="flex-1 ml-3">
                    <Text
                      className="text-text-primary font-semibold"
                      numberOfLines={1}
                    >
                      {firstItem?.name}
                    </Text>
                    <Text className="text-text-secondary text-sm mt-0.5">
                      {itemCount} {itemCount === 1 ? "item" : "items"} ·{" "}
                      {formatINR(order.totalPrice)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row flex-wrap mt-3 gap-2">
                  <View
                    className={`rounded-full px-3 py-1 ${getStatusBadge(
                      order.status,
                    )}`}
                  >
                    <Text className="text-xs font-semibold capitalize">
                      {order.status}
                    </Text>
                  </View>
                  <View
                    className={`rounded-full px-3 py-1 ${getPaymentStatusBadge(
                      order.paymentStatus,
                    )}`}
                  >
                    <Text className="text-xs font-semibold capitalize">
                      Payment: {order.paymentStatus}
                    </Text>
                  </View>
                  {order.paymentMethod && (
                    <View className="rounded-full px-3 py-1 bg-background-lighter">
                      <Text className="text-text-secondary text-xs font-semibold capitalize">
                        {order.paymentMethod}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

export default Orders;
