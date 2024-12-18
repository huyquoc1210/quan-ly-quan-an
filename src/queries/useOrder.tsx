import orderApiRequest from "@/apiRequest/order";
import {
  GetOrdersQueryParamsType,
  OrderParamType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetOrderList = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApiRequest.list(queryParams),
    queryKey: ["orders", queryParams],
  });
};

export const useGetOrderDetail = ({
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

export const usePayForGuestMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.pay,
  });
};

export const useCreateOrdersMutation = () => {
  return useMutation({
    mutationFn: orderApiRequest.createOrder,
  });
};
