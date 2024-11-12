import tableApiRequest from "@/apiRequest/table";
import {
  TableParamsType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetTableList = () => {
  return useQuery({
    queryKey: ["tables"],
    queryFn: tableApiRequest.list,
  });
};

export const useGetTable = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["tables", id],
    queryFn: () => tableApiRequest.getTable(id),
    enabled,
  });
};

export const useAddTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tableApiRequest.addTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};

export const useUpdateTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ number, ...body }: UpdateTableBodyType & TableParamsType) =>
      tableApiRequest.updateTable(number, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"], exact: true });
    },
  });
};

export const useDeleteTableMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: tableApiRequest.deleteTable,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
};
