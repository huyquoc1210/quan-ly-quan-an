import indicatorApiRequest from "@/apiRequest/indicator";
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

const useDashboardIndicator = (
  queryParams: DashboardIndicatorQueryParamsType
) => {
  return useQuery({
    queryKey: ["dashboardIndicator", queryParams],
    queryFn: () => indicatorApiRequest.getDashboardIndicators(queryParams),
  });
};

export default useDashboardIndicator;
