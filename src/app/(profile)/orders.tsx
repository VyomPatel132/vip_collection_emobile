import { SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useUserOrders } from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatINR } from "@/lib/payment";
import { Order } from "@/types";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

const getStatusBadge = (status: Order["status"]) => {
  switch (status) {
    case "confirmed":
      return "bg-primary/20 dark:bg-primary/20 text-primary dark:text-primary";
    case "shipped":
      return "bg-blue-500/20 dark:bg-blue-500/20 text-blue-400 dark:text-blue-400";
    case "delivered":
      return "bg-success/20 dark:bg-success/20 text-success dark:text-success";
    case "cancelled":
      return "bg-danger/20 dark:bg-danger/20 text-danger dark:text-danger";
    case "pending":
    default:
      return "bg-warning/20 dark:bg-warning/20 text-warning dark:text-warning";
  }
};

const getPaymentStatusBadge = (status: Order["paymentStatus"]) => {
  switch (status) {
    case "paid":
      return "bg-success/20 dark:bg-success/20 text-success dark:text-success";
    case "failed":
      return "bg-danger/20 dark:bg-danger/20 text-danger dark:text-danger";
    case "refunded":
      return "bg-surface-elevated dark:bg-surface-elevated text-text-tertiary dark:text-text-tertiary";
    case "pending":
    default:
      return "bg-warning/20 dark:bg-warning/20 text-warning dark:text-warning";
  }
};

const Orders = () => {
  const router = useRouter();
  const { colors } = useThemeColor();
  const { data: orders, isLoading, isError, refetch } = useUserOrders();

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (isError) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Icon name="alert-circle-outline" size={80} color="muted" />
          <Text className="text-text-primary dark:text-text-primary text-xl font-bold mt-4">
            Couldn’t load orders
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-primary dark:bg-primary rounded-2xl px-8 py-3 mt-6"
          >
            <Text className="text-on-primary dark:text-on-primary font-semibold">
              Try again
            </Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Icon name="receipt-outline" size={80} color="muted" />
          <Text className="text-text-primary dark:text-text-primary text-2xl font-bold mt-4">
            No orders yet
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary text-center mt-2">
            Your placed orders will appear here.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            className="bg-primary dark:bg-primary rounded-2xl px-8 py-4 mt-6"
          >
            <Text className="text-on-primary dark:text-on-primary font-bold text-base">
              Start Shopping
            </Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <Animated.View
        entering={FadeIn.duration(300)}
        className="flex-1 px-5 pb-6"
      >
        <ScreenHeader
          title="My Orders"
          right={
            <Text className="text-text-secondary dark:text-text-secondary text-sm">
              {orders.length} {orders.length === 1 ? "order" : "orders"}
            </Text>
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          {orders.map((order, idx) => {
            const itemCount = order.orderItems.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            const firstItem = order.orderItems[0];
            return (
              <Animated.View
                key={order._id}
                entering={FadeInUp.delay(idx * 60).duration(350)}
              >
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() =>
                    router.push({
                      pathname: "/(profile)/orders/[orderId]" as any,
                      params: { orderId: order._id },
                    })
                  }
                  className="bg-surface dark:bg-surface rounded-3xl p-4 mb-4"
                >
                  <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-text-primary dark:text-text-primary font-bold">
                      #{order._id.slice(-8).toUpperCase()}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary text-xs">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>

                  <View className="flex-row items-center">
                    {firstItem && firstItem.images?.[0] && (
                      <Image
                        source={firstItem.images[0]}
                        style={{ width: 56, height: 56, borderRadius: 10 }}
                        className="bg-surface-elevated dark:bg-surface-elevated"
                      />
                    )}
                    <View className="flex-1 ml-3">
                      <Text
                        className="text-text-primary dark:text-text-primary font-semibold"
                        numberOfLines={1}
                      >
                        {firstItem?.name}
                      </Text>
                      <Text className="text-text-secondary dark:text-text-secondary text-sm mt-0.5">
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
                      <View className="rounded-full px-3 py-1 bg-surface-elevated dark:bg-surface-elevated">
                        <Text className="text-text-secondary dark:text-text-secondary text-xs font-semibold capitalize">
                          {order.paymentMethod}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </SafeScreen>
  );
};

export default Orders;
