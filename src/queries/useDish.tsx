import dishApiRequest from "@/apiRequest/dishes";
import {
  DishParamsType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetDishList = () => {
  return useQuery({
    queryKey: ["dishes"],
    queryFn: dishApiRequest.list,
  });
};

export const useGetDish = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled,
  });
};

export const useAddDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dishApiRequest.addDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & DishParamsType) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"], exact: true });
    },
  });
};

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
  });
};
