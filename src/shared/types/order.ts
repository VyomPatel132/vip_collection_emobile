// Order domain types. The backend's `Order` Mongoose model is the
// source of truth — these interfaces mirror its serialized output so
// every consumer (mobile, admin) agrees on the field names.

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface OrderPaymentResult {
  id?: string;
  orderId?: string;
  signature?: string;
  status?: string;
  provider?: string;
  method?: string;
  amount?: number;
  currency?: string;
  captured?: boolean;
  email?: string;
  contact?: string;
  bank?: string;
  wallet?: string;
  vpa?: string;
  cardLast4?: string;
  cardNetwork?: string;
  refundedAt?: string;
}

export interface OrderItem {
  _id: string;
  // Populated by the backend with the full Product document on
  // listing/detail endpoints. Always treat the populated form as the
  // canonical one — the unpopulated form is just `{ product: string }`.
  product?: {
    _id: string;
    name: string;
    images?: string[];
    price?: number;
  };
  name: string;
  price: number;
  quantity: number;
  images: string[];
}

export interface ShippingAddress {
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

export interface Order {
  _id: string;
  user?: {
    _id: string;
    name?: string;
    email?: string;
  };
  clerkId: string;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentResult: OrderPaymentResult;
  paymentMethod?: string;
  paymentStatus: PaymentStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  totalPrice: number;
  status: OrderStatus;
  hasReviewed?: boolean;
  shippedAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PricingLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PricingSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
