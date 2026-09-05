import { useApi } from "@/lib/api";
import { Order } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useUserOrders = () => {
  const api = useApi();

  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get<{ orders: Order[] }>("/orders");
      return data.orders;
    },
  });
};

export const useUserOrder = (orderId?: string) => {
  const api = useApi();

  return useQuery({
    queryKey: ["orders", orderId],
    // Enable the query as soon as an id is available. The previous
    // implementation had `&& !orders.data` which short-circuited the
    // detail fetch whenever the list query had cached data — so the
    // order-detail screen was stuck showing the previous screen's
    // loading state once the user had visited /orders at least once.
    enabled: !!orderId,
    queryFn: async () => {
      const { data } = await api.get<{ order: Order }>(`/orders/${orderId}`);
      return data.order;
    },
  });
};
