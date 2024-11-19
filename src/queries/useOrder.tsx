import orderApiRequest from "@/apiRequest/order";
import {
  OrderParamType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetOrderList = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: orderApiRequest.list,
  });
};

export const useGetOrder = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: () => orderApiRequest.getOrder(id),
    enabled,
  });
};

export const useAddOrderMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.addOrder,
  });
};

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ orderId, ...body }: UpdateOrderBodyType & OrderParamType) =>
      orderApiRequest.updateOrder(orderId, body),
  });
};
