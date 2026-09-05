// Re-export of `@vip/shared/format` so existing `import { formatINR } from
// "@/lib/payment"` call sites keep working. Pricing *totals* (subtotal,
// shipping, tax, total) are owned by the backend — see
// `usePricingPreview` and the `pricing` field on the response of
// `POST /api/payment/create-order`.
//
// We keep an in-repo copy under `src/shared/` (mirrored from the
// canonical `D:/Projects/shared/` checkout) so Expo's Metro bundler
// can resolve the import at build time. See `src/shared/README.md`.
export { formatINR } from "../shared/format";
