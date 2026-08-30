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
  const orders = useUserOrders();

  return useQuery({
    queryKey: ["orders", orderId],
    enabled: !!orderId && !orders.data,
    queryFn: async () => {
      const { data } = await api.get<{ order: Order }>(`/orders/${orderId}`);
      return data.order;
    },
  });
};
