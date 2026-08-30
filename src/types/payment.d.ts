type CartItem = {
  _id: string;
  quantity: number;
  product: {
    _id: string;
    name: string;
    price: number;
    images: string[];
  };
};

type ShippingAddress = {
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
};

type CreateCheckoutPayload = {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
};

type CreateOrderResponse = {
  success?: boolean;
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
};

type VerifyPaymentResponse = {
  success: boolean;
  order?: any;
  message?: string;
};
