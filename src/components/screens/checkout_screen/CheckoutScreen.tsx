import { ErrorUI, LoadingUI, SafeScreen } from "@/components/custom";
import { useAddresses, useCart, useCheckout } from "@/hooks";
import { Address, CartItem } from "@/types";
import { computePricing, formatINR } from "@/lib/payment";
import { Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/expo";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const CheckoutScreen = () => {
  const router = useRouter();
  const { user } = useUser();
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

  const selectedAddress =
    addresses.find((a: Address) => a._id === selectedAddressId) ||
    defaultAddress;

  const cartItems: CartItem[] = cart?.items ?? [];
  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [cartItems],
  );
  const pricing = computePricing(subtotal);

  if (isLoadingCart || isLoadingAddresses) return <LoadingUI />;
  if (isAddressesError) return <ErrorUI />;

  if (cartItems.length === 0) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="cart-outline" size={80} color="#666" />
          <Text className="text-text-primary text-2xl font-bold mt-4">
            Your cart is empty
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add something to your cart before checking out.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            onPress={() => router.replace("/(tabs)/cart")}
          >
            <Text className="text-background font-bold text-base">
              Back to cart
            </Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  if (addresses.length === 0 || !selectedAddress) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="location-outline" size={80} color="#666" />
          <Text className="text-text-primary text-2xl font-bold mt-4">
            No address on file
          </Text>
          <Text className="text-text-secondary text-center mt-2">
            Add a delivery address to continue with checkout.
          </Text>
          <TouchableOpacity
            className="bg-primary rounded-2xl px-8 py-4 mt-6"
            onPress={() => router.push("/(profile)/addresses")}
          >
            <Text className="text-background font-bold text-base">
              Add Address
            </Text>
          </TouchableOpacity>
        </View>
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
          Alert.alert(
            "Payment failed",
            error?.response?.data?.error ||
              error?.message ||
              "Could not complete payment. Please try again.",
          );
        },
      },
    );
  };

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pb-32">
        <View className="flex-row items-center justify-between py-5">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-row items-center"
          >
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text className="text-text-primary text-2xl font-bold">
            Checkout
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
        >
          <Text className="text-text-primary text-lg font-semibold mb-3">
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
                    ? "border-primary bg-surface"
                    : "border-surface bg-surface/60"
                }`}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={
                        isSelected
                          ? "radio-button-on"
                          : "radio-button-off"
                      }
                      size={20}
                      color={isSelected ? "#1db954" : "#666"}
                    />
                    <Text className="text-text-primary font-bold ml-2">
                      {address.label || "Address"}
                    </Text>
                    {address.isDefault && (
                      <View className="ml-2 bg-primary/20 rounded-full px-2 py-0.5">
                        <Text className="text-primary text-xs font-semibold">
                          Default
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <Text className="text-text-primary mt-2">
                  {address.fullName}
                </Text>
                <Text className="text-text-secondary text-sm mt-1">
                  {address.streetAddress}
                </Text>
                <Text className="text-text-secondary text-sm">
                  {address.city}, {address.state} {address.zipCode}
                </Text>
                <Text className="text-text-secondary text-sm mt-1">
                  {address.phoneNumber}
                </Text>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity
            onPress={() => router.push("/(profile)/addresses")}
            className="flex-row items-center justify-center py-3 mb-6"
          >
            <Ionicons name="add-circle-outline" size={20} color="#1db954" />
            <Text className="text-primary font-semibold ml-2">
              Manage addresses
            </Text>
          </TouchableOpacity>

          <Text className="text-text-primary text-lg font-semibold mb-3">
            Order Summary
          </Text>

          <View className="bg-surface rounded-2xl p-4 mb-6">
            {cartItems.map((item) => (
              <View
                key={item._id}
                className="flex-row items-center mb-3 last:mb-0"
              >
                <Image
                  source={item.product.images[0]}
                  style={{ width: 56, height: 56, borderRadius: 10 }}
                  className="bg-background-lighter"
                />
                <View className="flex-1 ml-3">
                  <Text
                    className="text-text-primary font-semibold"
                    numberOfLines={1}
                  >
                    {item.product.name}
                  </Text>
                  <Text className="text-text-secondary text-sm">
                    Qty {item.quantity} · {formatINR(item.product.price)}
                  </Text>
                </View>
                <Text className="text-text-primary font-semibold">
                  {formatINR(item.product.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          <View className="bg-surface rounded-2xl p-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary">Subtotal</Text>
              <Text className="text-text-primary font-semibold">
                {formatINR(pricing.subtotal)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-text-secondary">Shipping</Text>
              <Text className="text-text-primary font-semibold">
                {formatINR(pricing.shipping)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-3">
              <Text className="text-text-secondary">Tax (8%)</Text>
              <Text className="text-text-primary font-semibold">
                {formatINR(pricing.tax)}
              </Text>
            </View>
            <View className="h-px bg-background-lighter my-2" />
            <View className="flex-row justify-between mt-1">
              <Text className="text-text-primary text-lg font-bold">
                Total
              </Text>
              <Text className="text-primary text-lg font-bold">
                {formatINR(pricing.total)}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 bg-background px-5 pb-4 pt-3 border-t border-surface">
          <View className="flex-row items-center mb-3">
            <Ionicons name="lock-closed" size={16} color="#1db954" />
            <Text className="text-text-secondary text-xs ml-2">
              Payments are processed securely by Razorpay
            </Text>
          </View>
          <TouchableOpacity
            className="bg-primary rounded-2xl py-4 items-center"
            activeOpacity={0.8}
            disabled={isCheckingOut}
            onPress={handlePay}
          >
            {isCheckingOut ? (
              <ActivityIndicator size="small" color="#121212" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons
                  name="shield-checkmark"
                  size={18}
                  color="#121212"
                />
                <Text className="text-background font-bold text-base ml-2">
                  Pay {formatINR(pricing.total)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          {user?.primaryEmailAddress?.emailAddress && (
            <Text className="text-text-secondary text-xs text-center mt-2">
              Receipt will be sent to {user.primaryEmailAddress.emailAddress}
            </Text>
          )}
        </View>
      </View>
    </SafeScreen>
  );
};
