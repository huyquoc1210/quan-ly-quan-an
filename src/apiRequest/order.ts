import http from "@/lib/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

const prefix = "/orders";

const orderApiRequest = {
  list: (queryParams: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      `${prefix}?${queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString(),
      })}`
    ),
  getOrder: (id: number) => http.get<GetOrderDetailResType>(`${prefix}/${id}`),
  addOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`${prefix}`, body),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`${prefix}/${orderId}`, body),
  pay: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`${prefix}/pay`, body),
  createOrder: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>(`${prefix}`, body),
};

export default orderApiRequest;
