import { useApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface PricingLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface PricingPreview {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  lines: PricingLine[];
}

// Calls `POST /api/payment/preview` to fetch the server-canonical
// pricing for a cart. Used by the checkout screen so the numbers shown
// to the user are exactly what they'll be charged — no client-side
// tax / shipping math.
//
// The backend returns the numbers nested under a `pricing` key
// (matching the `create-order` response shape), e.g.:
//   { success: true, pricing: { subtotal, shipping, tax, total }, lines: [...] }
// The hook flattens that to a `PricingPreview` for the screen so the
// UI doesn't have to know about the wrapper.
//
// `enabled` gates the request on a non-empty cart. The hook returns
// `pricing: null` while the preview is loading or has not been kicked
// off; the screen should render a neutral placeholder in that state
// rather than a fake total.
export const usePricingPreview = (cartItems: any[] | undefined) => {
  const api = useApi();

  const safeItems = Array.isArray(cartItems) ? cartItems : [];

  return useQuery<PricingPreview>({
    queryKey: ["pricing-preview", safeItems],
    queryFn: async () => {
      const { data } = await api.post<
        PricingPreview & {
          success: boolean;
          pricing: PricingPreview;
        }
      >("/payment/preview", { cartItems: safeItems });
      return {
        subtotal: data.pricing.subtotal,
        shipping: data.pricing.shipping,
        tax: data.pricing.tax,
        total: data.pricing.total,
        lines: data.lines,
      };
    },
    enabled: safeItems.length > 0,
    // The cart rarely changes during a checkout session; a long stale
    // window is fine and reduces flicker if the user toggles quantity
    // momentarily.
    staleTime: 30_000,
  });
};
