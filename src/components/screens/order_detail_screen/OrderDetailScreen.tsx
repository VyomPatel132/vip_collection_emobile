import { SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import { useUserOrder } from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { formatINR } from "@/lib/payment";
import { Order, OrderItem } from "@/types";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
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
      return "bg-success/20 text-success";
    case "cancelled":
      return "bg-danger/20 text-danger";
    case "pending":
    default:
      return "bg-warning/20 text-warning";
  }
};

const getPaymentStatusBadge = (status: Order["paymentStatus"]) => {
  switch (status) {
    case "paid":
      return "bg-success/20 text-success";
    case "failed":
      return "bg-danger/20 text-danger";
    case "refunded":
      return "bg-surface-elevated text-text-secondary";
    case "pending":
    default:
      return "bg-warning/20 text-warning";
  }
};

const firstImage = (item: OrderItem): string | undefined => item.images?.[0];

export const OrderDetailScreen = () => {
  const router = useRouter();
  const { orderId } = useLocalSearchParams<{ orderId?: string }>();
  const { data: order, isLoading, isError, refetch } = useUserOrder(orderId);
  const { colors } = useThemeColor();

  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeScreen>
    );
  }

  if (isError || !order) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Icon name="alert-circle-outline" size={80} color="muted" />
          <Text className="text-text-primary dark:text-text-primary text-xl font-bold mt-4">
            Couldn’t load this order
          </Text>
          <TouchableOpacity
            onPress={() => refetch()}
            className="bg-primary dark:bg-primary rounded-2xl px-8 py-3 mt-6"
          >
            <Text className="text-on-primary font-semibold">Try again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.back()}
            className="mt-3"
          >
            <Text className="text-text-secondary dark:text-text-secondary">Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  const itemCount = order.orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pb-6">
        <ScreenHeader title="Order" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-text-primary dark:text-text-primary text-lg font-bold">
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

          <View className="flex-row flex-wrap gap-2 mb-5">
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

          <Text className="text-text-primary dark:text-text-primary text-lg font-semibold mb-3">
            Items ({itemCount})
          </Text>
          <View className="bg-surface dark:bg-surface rounded-2xl p-4 mb-6">
            {order.orderItems.map((item) => {
              const thumb = firstImage(item);
              return (
                <View
                  key={item._id}
                  className="flex-row items-center mb-3 last:mb-0"
                >
                  {thumb ? (
                    <Image
                      source={thumb}
                      style={{ width: 56, height: 56, borderRadius: 10 }}
                      className="bg-surface-elevated dark:bg-surface-elevated"
                    />
                  ) : (
                    <View
                      style={{ width: 56, height: 56, borderRadius: 10 }}
                      className="bg-surface-elevated dark:bg-surface-elevated items-center justify-center"
                    >
                      <Icon name="image-outline" size={20} color="muted" />
                    </View>
                  )}
                  <View className="flex-1 ml-3">
                    <Text
                      className="text-text-primary dark:text-text-primary font-semibold"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-text-secondary dark:text-text-secondary text-sm mt-0.5">
                      Qty {item.quantity} · {formatINR(item.price)}
                    </Text>
                  </View>
                  <Text className="text-text-primary dark:text-text-primary font-semibold">
                    {formatINR(item.price * item.quantity)}
                  </Text>
                </View>
              );
            })}
          </View>

          <Text className="text-text-primary dark:text-text-primary text-lg font-semibold mb-3">
            Delivery address
          </Text>
          <View className="bg-surface dark:bg-surface rounded-2xl p-4 mb-6">
            <Text className="text-text-primary dark:text-text-primary font-semibold">
              {order.shippingAddress.fullName}
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary text-sm mt-1">
              {order.shippingAddress.streetAddress}
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary text-sm">
              {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
              {order.shippingAddress.zipCode}
            </Text>
            <Text className="text-text-secondary dark:text-text-secondary text-sm mt-1">
              {order.shippingAddress.phoneNumber}
            </Text>
          </View>

          <Text className="text-text-primary dark:text-text-primary text-lg font-semibold mb-3">
            Price breakdown
          </Text>
          <View className="bg-surface dark:bg-surface rounded-2xl p-4 mb-6">
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary dark:text-text-secondary">Subtotal</Text>
              <Text className="text-text-primary dark:text-text-primary font-semibold">
                {formatINR(order.subtotal)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary dark:text-text-secondary">Shipping</Text>
              <Text className="text-text-primary dark:text-text-primary font-semibold">
                {formatINR(order.shipping)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-text-secondary dark:text-text-secondary">Tax</Text>
              <Text className="text-text-primary dark:text-text-primary font-semibold">
                {formatINR(order.tax)}
              </Text>
            </View>
            <View className="h-px bg-surface-elevated dark:bg-surface-elevated my-2" />
            <View className="flex-row justify-between mt-1">
              <Text className="text-text-primary dark:text-text-primary text-lg font-bold">
                Total
              </Text>
              <Text className="text-primary dark:text-primary text-lg font-bold">
                {formatINR(order.totalPrice)}
              </Text>
            </View>
          </View>

          {order.paymentResult?.id && (
            <View className="bg-surface dark:bg-surface rounded-2xl p-4">
              <Text className="text-text-secondary dark:text-text-secondary text-xs mb-1">
                Razorpay payment id
              </Text>
              <Text
                className="text-text-primary dark:text-text-primary text-sm font-mono"
                numberOfLines={1}
              >
                {order.paymentResult.id}
              </Text>
              {order.paymentResult.method && (
                <Text className="text-text-secondary dark:text-text-secondary text-xs mt-2 capitalize">
                  Method: {order.paymentResult.method}
                  {order.paymentResult.cardLast4
                    ? ` · **** ${order.paymentResult.cardLast4}`
                    : ""}
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </View>
    </SafeScreen>
  );
};
