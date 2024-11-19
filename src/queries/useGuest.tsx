import guestApiRequest from "@/apiRequest/guest";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.addOrder,
  });
};

export const useGuestGetOrderList = () => {
  return useQuery({
    queryKey: ["guest-order"],
    queryFn: guestApiRequest.order,
  });
};
