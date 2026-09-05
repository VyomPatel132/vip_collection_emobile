import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useProducts = () => {
  const api = useApi();

  const result = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await api.get<Product[]>("/products");
      return data;
    },
    // The catalogue changes only when an admin adds/edits a product.
    // A 1-minute stale window keeps tab switches snappy and avoids
    // refetching on every back-navigation.
    staleTime: 60_000,
  });

  return result;
};
