// ---------------------------------------------------------------------------
// Display-only INR formatter. Pricing *totals* (subtotal, shipping, tax,
// total) are owned by the backend — see `POST /api/payment/preview` and the
// `pricing` field on each `Order`. This helper just renders whatever
// number the server returned in the user's locale (en-IN, ₹).
//
// Both the Expo mobile app and the Vite admin SPA import this. Keep the
// implementation here in lock-step with any future locale changes.
// ---------------------------------------------------------------------------
export const formatINR = (amount: number): string => {
  const safe = Number.isFinite(amount) ? amount : 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(safe);
};
