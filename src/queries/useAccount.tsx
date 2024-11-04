import accountApiRequest from "@/apiRequest/account";
import QUERY_KEYS from "@/constants/query-keys";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountMe = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.PROFILE],
    queryFn: accountApiRequest.me,
  });
};

export const useAccountMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2,
  });
};
