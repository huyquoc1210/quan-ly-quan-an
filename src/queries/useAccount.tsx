import accountApiRequest from "@/apiRequest/account";
import QUERY_KEYS from "@/constants/query-keys";
import { useQuery } from "@tanstack/react-query";

export const useAccountProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.PROFILE],
    queryFn: accountApiRequest.me,
  });
};
