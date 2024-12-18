import accountApiRequest from "@/apiRequest/account";
import QUERY_KEYS from "@/constants/query-keys";
import {
  AccountIdParamType,
  GetGuestListQueryParamsType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAccountMe = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.ACCOUNT.PROFILE],
    queryFn: accountApiRequest.me,
  });
};

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePasswordV2,
  });
};

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountApiRequest.list,
  });
};

export const useGetAccount = ({
  id,
  enabled,
}: AccountIdParamType & { enabled: boolean }) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled,
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & AccountIdParamType) =>
      accountApiRequest.updateEmployee(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"], exact: true });
    },
  });
};

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.createGuest,
  });
};

export const useGuestListQuery = (queryParams: GetGuestListQueryParamsType) => {
  return useQuery({
    queryKey: ["guests", queryParams],
    queryFn: () => accountApiRequest.guestList(queryParams),
  });
};
