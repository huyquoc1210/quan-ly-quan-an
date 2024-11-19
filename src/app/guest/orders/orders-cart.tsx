"use client";

import { Badge } from "@/components/ui/badge";
import socket from "@/lib/socket";
import { formatCurrency, getVietnameseOrderStatus } from "@/lib/utils";
import { useGuestGetOrderList } from "@/queries/useGuest";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect } from "react";

const OrdersCart = () => {
  const { data, refetch } = useGuestGetOrderList();
  const orders = data?.payload.data ?? [];

  const totalPrice = orders.reduce((result, order) => {
    return result + order.dishSnapshot.price * order.quantity;
  }, 0);

  useEffect(() => {
    const onConnect = () => {
      console.log(socket.id);
    };

    const onDisconnect = () => {
      console.log("disconnect");
    };

    const onUpdateOrder = (data: UpdateOrderResType["data"]) => {
      refetch();
    };

    if (socket.connected) {
      onConnect();
    }
    socket.on("update-order", onUpdateOrder);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
    };
  }, []);

  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="text-sm font-semibold">{index + 1}</div>
          <div className="flex-shrink-0 relative">
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
            />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{" "}
              <Badge className="px-1">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant={"outline"}>
              {getVietnameseOrderStatus(order.status)}
            </Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <div className="w-full space-x-4 flex font-semibold">
          <span>Tổng cộng · {orders.length} món</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  );
};

export default OrdersCart;
