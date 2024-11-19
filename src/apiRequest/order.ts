import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const prefix = "/orders";

const orderApiRequest = {
  list: () => http.get<GetOrdersResType>(`${prefix}`),
  getOrder: (id: number) => http.get<GetOrderDetailResType>(`${prefix}/${id}`),
  addOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`${prefix}`, body),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body),
};

export default orderApiRequest;
