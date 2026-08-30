export const formatINR = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);

// Flat shipping fee that matches the backend (see payment.controller.ts).
export const SHIPPING_FEE = 10;
// Tax rate (8% of subtotal) that matches the backend.
export const TAX_RATE = 0.08;

export const computePricing = (subtotal: number) => {
  const safeSubtotal = Number.isFinite(subtotal) ? subtotal : 0;
  const shipping = safeSubtotal > 0 ? SHIPPING_FEE : 0;
  const tax = Number((safeSubtotal * TAX_RATE).toFixed(2));
  const total = Number((safeSubtotal + shipping + tax).toFixed(2));
  return { subtotal: safeSubtotal, shipping, tax, total };
};
