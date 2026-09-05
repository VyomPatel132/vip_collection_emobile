import { useApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import RazorpayCheckout from "react-native-razorpay";

// Lightweight RFC 4122 v4-ish UUID. We don't need cryptographic strength
// here — just a stable per-checkout token that the backend can use to
// de-dupe `createPaymentOrder` calls.
const newIdempotencyKey = (): string => {
  // `Math.random` is fine for non-secret tokens.
  const rand = () => Math.floor(Math.random() * 0x10000).toString(16).padStart(4, "0");
  return `${rand()}${rand()}-${rand()}-4${rand().slice(1)}-${rand()}-${rand()}${rand()}${rand()}`;
};

export const useCheckout = () => {
  const api = useApi();

  // One idempotency key per "Place Order" intent. Re-used across a
  // double-tap on the same checkout and across any axios retry of the
  // first call, so the backend's `createPaymentOrder` collapses them
  // into a single Razorpay order. `resetKey()` is exposed so a
  // successful payment (or an explicit retry button) can start a new
  // intent with a fresh key.
  const idempotencyKeyRef = useRef<string>(newIdempotencyKey());
  const resetKey = useCallback(() => {
    idempotencyKeyRef.current = newIdempotencyKey();
  }, []);

  const mutation = useMutation({
    mutationFn: async ({
      cartItems,
      shippingAddress,
    }: CreateCheckoutPayload) => {
      const { data } = await api.post<CreateOrderResponse>(
        "/payment/create-order",
        { cartItems, shippingAddress },
        {
          headers: {
            "Idempotency-Key": idempotencyKeyRef.current,
          },
        },
      );

      if (!data?.orderId) {
        throw new Error("Razorpay order was not created");
      }
      if (!data?.keyId) {
        throw new Error("Razorpay key was not returned");
      }

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "Your App Name",
        description: "Order Payment",
        order_id: data.orderId,

        theme: {
          color: "#1db954",
        },
      };

      const paymentData = await RazorpayCheckout.open(options);

      const { data: verification } = await api.post<VerifyPaymentResponse>(
        "/payment/verify",
        {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
        },
      );

      if (!verification.success) {
        throw new Error(verification.message || "Payment verification failed");
      }

      return {
        ...verification,
        razorpayOrderId: paymentData.razorpay_order_id,
        razorpayPaymentId: paymentData.razorpay_payment_id,
      };
    },
  });

  return { ...mutation, resetKey };
};
