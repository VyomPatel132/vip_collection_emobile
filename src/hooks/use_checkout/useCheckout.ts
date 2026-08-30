import { useApi } from "@/lib/api";
import { useMutation } from "@tanstack/react-query";
import RazorpayCheckout from "react-native-razorpay";

export const useCheckout = () => {
  const api = useApi();

  return useMutation({
    mutationFn: async ({
      cartItems,
      shippingAddress,
    }: CreateCheckoutPayload) => {
      const { data } = await api.post<CreateOrderResponse>(
        "/payments/create-order",
        {
          cartItems,
          shippingAddress,
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
        "/payments/verify",
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
};
