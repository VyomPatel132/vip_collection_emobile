import { ErrorUI, LoadingUI, SafeScreen } from "@/components/custom";
import { Icon, ScreenHeader } from "@/components/ui";
import {
  useAddresses,
  useCart,
  useCheckout,
  usePricingPreview,
} from "@/hooks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Address, CartItem } from "@/types";
import { formatINR } from "@/lib/payment";
import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

export const CheckoutScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const { colors } = useThemeColor();
  const {
    addresses,
    isLoading: isLoadingAddresses,
    isError: isAddressesError,
  } = useAddresses();
  const { cart, isLoading: isLoadingCart, clearCart } = useCart();
  const { mutate: createCheckout, isPending: isCheckingOut } = useCheckout();

  const defaultAddress = useMemo(
    () => addresses.find((a: Address) => a.isDefault) || addresses[0],
    [addresses],
  );
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    defaultAddress?._id ?? null,
  );

  // When `addresses` finishes loading (e.g. the user navigates here
  // before the addresses query has resolved), `defaultAddress` is
  // recomputed but `selectedAddressId` was set on first render to
  // `null` and stays that way — the checkout screen then has no
  // selection. Sync the state whenever we have a default but no
  // selection, but **never** override an explicit user choice.
  useEffect(() => {
    if (!selectedAddressId && defaultAddress?._id) {
      setSelectedAddressId(defaultAddress._id);
    }
  }, [selectedAddressId, defaultAddress]);

  const selectedAddress =
    addresses.find((a: Address) => a._id === selectedAddressId) ||
    defaultAddress;

  const cartItems: CartItem[] = cart?.items ?? [];

  // Server-canonical pricing. The mobile client never computes
  // subtotal / shipping / tax / total itself — those numbers come from
  // `POST /api/payment/preview`. While the preview is loading we show
  // a neutral "—" placeholder so the user doesn't see a fake total.
  const previewItems = useMemo(
    () =>
      cartItems.map((it) => ({
        product: { _id: it.product._id },
        quantity: it.quantity,
      })),
    [cartItems],
  );
  const { data: preview, isLoading: isPreviewLoading } =
    usePricingPreview(previewItems);

  if (isLoadingCart || isLoadingAddresses) return <LoadingUI />;
  if (isAddressesError) return <ErrorUI />;

  if (cartItems.length === 0) {
    return (
      <SafeScreen>
        <Animated.View
          entering={FadeIn.duration(400)}
          className="flex-1 items-center justify-center px-6"
        >
          <Icon name="bag-handle-outline" size={80} color="muted" />
          <Text className="text-text-primary dark:text-text-primary text-2xl font-bold mt-4">
            Your cart is empty
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary text-center mt-2">
            Add something to your cart before checking out.
          </Text>
          <TouchableOpacity
            className="bg-primary dark:bg-primary rounded-2xl px-8 py-4 mt-6"
            onPress={() => router.replace("/(tabs)/cart")}
          >
            <Text className="text-on-primary dark:text-on-primary font-bold text-base">
              Back to cart
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeScreen>
    );
  }

  if (addresses.length === 0 || !selectedAddress) {
    return (
      <SafeScreen>
        <Animated.View
          entering={FadeIn.duration(400)}
          className="flex-1 items-center justify-center px-6"
        >
          <Icon name="location-outline" size={80} color="muted" />
          <Text className="text-text-primary dark:text-text-primary text-2xl font-bold mt-4">
            No address on file
          </Text>
          <Text className="text-text-secondary dark:text-text-secondary text-center mt-2">
            Add a delivery address to continue with checkout.
          </Text>
          <TouchableOpacity
            className="bg-primary dark:bg-primary rounded-2xl px-8 py-4 mt-6"
            onPress={() => router.push("/(profile)/addresses")}
          >
            <Text className="text-on-primary dark:text-on-primary font-bold text-base">
              Add Address
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeScreen>
    );
  }

  const handlePay = () => {
    if (!selectedAddress) {
      Alert.alert("Select an address", "Please choose a delivery address.");
      return;
    }

    createCheckout(
      {
        cartItems,
        shippingAddress: {
          name: selectedAddress.fullName,
          phone: selectedAddress.phoneNumber,
          addressLine1: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          pincode: selectedAddress.zipCode,
        },
      },
      {
        onSuccess: (data: any) => {
          clearCart();
          const orderId = data?.order?._id ?? data?.razorpayOrderId ?? "";
          router.replace(
            orderId
              ? `/(profile)/order-success?id=${orderId}`
              : "/(profile)/order-success",
          );
        },
        onError: (error: any) => {
          const detail = error?.response?.data?.detail;
          const message =
            error?.response?.data?.error ||
            error?.message ||
            "Could not complete payment. Please try again.";
          Alert.alert(
            "Payment failed",
            detail ? `${message}\n\n${detail}` : message,
          );
        },
      },
    );
  };

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pb-32">
        <ScreenHeader title="Checkout" variant="chevron" bordered={false} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text className="text-text-primary dark:text-text-primary text-lg font-semibold mb-3">
            Delivery Address
          </Text>

          {addresses.map((address: Address) => {
            const isSelected = address._id === selectedAddressId;
            return (
              <TouchableOpacity
                key={address._id}
                activeOpacity={0.85}
                onPress={() => setSelectedAddressId(address._id)}
                className={`rounded-2xl p-4 mb-3 border ${
                  isSelected
                    ? "border-primary dark:border-primary bg-surface dark:bg-surface"
                    : "border-border dark:border-border bg-surface/60 dark:bg-surface/60"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Icon
                      name={
                        isSelected
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={20}
                      color={isSelected ? "primary" : "muted"}
                    />
                    <Text className="text-text-primary dark:text-text-primary font-bold ml-2">
                      {address.label || "Address"}
                    </Text>
                    {address.isDefault && (
                      <View className="ml-2 bg-primary/20 rounded-full px-2 py-0.5">
                        <Text className="text-primary dark:text-primary text-xs font-semibold">
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text className="text-text-primary dark:text-text-primary mt-2">
                  {address.fullName}
                </Text>
                <Text className="text-text-secondary dark:text-text-secondary text-sm mt-1">
                  {address.streetAddress}
                </Text>
                <Text className="text-text-secondary dark:text-text-secondary text-sm">
                  {address.city}, {address.state} {address.zipCode}
                </Text>
                <Text className="text-text-secondary dark:text-text-secondary text-sm mt-1">
                  {address.phoneNumber}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => router.push("/(profile)/addresses")}
            className="flex-row items-center justify-center py-3 mb-6"
          >
            <Icon name="add-circle-outline" size={20} color="primary" />
            <Text className="text-primary dark:text-primary font-semibold ml-2">
              Manage addresses
            </Text>
          </TouchableOpacity>

          <Text className="text-text-primary dark:text-text-primary text-lg font-semibold mb-3">
            Order Summary
          </Text>

          <View className="bg-surface dark:bg-surface rounded-2xl p-4 mb-6">
            {cartItems.map((item) => (
              <View
                key={item._id}
                className="flex-row items-center mb-3 last:mb-0"
              >
                <Image
                  source={item.product.images[0]}
                  style={{ width: 56, height: 56, borderRadius: 10 }}
                  className="bg-surface-elevated dark:bg-surface-elevated"
                />
                <View className="flex-1 ml-3">
                  <Text
                    className="text-text-primary dark:text-text-primary font-semibold"
                    numberOfLines={1}
                  >
                    {item.product.name}
                  </Text>
                  <Text className="text-text-secondary dark:text-text-secondary text-sm">
                    Qty {item.quantity} · {formatINR(item.product.price)}
                  </Text>
                </View>
                <Text className="text-text-primary dark:text-text-primary font-semibold">
                  {formatINR(item.product.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View className="bg-surface dark:bg-surface rounded-2xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary dark:text-text-secondary">Subtotal</Text>
              <Text className="text-text-primary dark:text-text-primary font-semibold">
                {preview ? formatINR(preview.subtotal) : "—"}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary dark:text-text-secondary">Shipping</Text>
              <Text className="text-text-primary dark:text-text-primary font-semibold">
                {preview ? formatINR(preview.shipping) : "—"}
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-text-secondary dark:text-text-secondary">Tax (8%)</Text>
              <Text className="text-text-primary dark:text-text-primary font-semibold">
                {preview ? formatINR(preview.tax) : "—"}
              </Text>
            </View>
            <View className="h-px bg-surface-elevated dark:bg-surface-elevated my-2" />
            <View className="flex-row justify-between mt-1">
              <Text className="text-text-primary dark:text-text-primary text-lg font-bold">
                Total
              </Text>
              <Text className="text-primary dark:text-primary text-lg font-bold">
                {preview ? formatINR(preview.total) : "—"}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-background dark:bg-background px-5 pb-4 pt-3 border-t border-border dark:border-border">
          <View className="flex-row items-center mb-3">
            <Icon name="lock-closed" size={16} color="primary" />
            <Text className="text-text-secondary dark:text-text-secondary text-xs ml-2">
              Payments are processed securely by Razorpay
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary dark:bg-primary rounded-2xl py-4 items-center"
            activeOpacity={0.8}
            // Disable until the server-canonical pricing is in hand;
            // paying on a placeholder total would either mismatch the
            // Razorpay charge or look like a bug.
            disabled={isCheckingOut || !preview}
            onPress={handlePay}
          >
            {isCheckingOut || !preview ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <View className="flex-row items-center">
                <Icon name="shield-checkmark" size={18} color="onPrimary" />
                <Text className="text-on-primary dark:text-on-primary font-bold text-base ml-2">
                  Pay {formatINR(preview.total)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {user?.primaryEmailAddress?.emailAddress && (
            <Text className="text-text-secondary dark:text-text-secondary text-xs text-center mt-2">
              Receipt will be sent to {user.primaryEmailAddress.emailAddress}
            </Text>
          )}
        </View>
      </View>
    </SafeScreen>
  );
};
