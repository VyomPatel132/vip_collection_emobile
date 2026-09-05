import { useApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Category {
  name: string;
  count: number;
}

interface CategoriesResponse {
  categories: Category[];
}

// Calls `GET /api/categories` and returns the list of product
// categories that currently exist in the catalogue, with a leading
// "All" entry. The shop screen renders this as the category chip
// strip so it reflects what the catalogue actually contains rather
// than a hard-coded list.
export const useCategories = () => {
  const api = useApi();

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get<CategoriesResponse>("/products/categories");
      return data.categories;
    },
    // Categories change only when an admin adds/removes one. A long
    // stale window keeps the chip strip snappy across navigations.
    staleTime: 5 * 60_000,
  });
};
