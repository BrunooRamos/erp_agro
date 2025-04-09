import { getCostCenter } from "../../actions/cost-center/cost_center_actions";
import { useBaseQuery } from "../config/useBaseQuery";

export const useCostCenter = (
  startDate: string,
  endDate: string,
  shouldFetch: boolean = false
) => {
  const getAllCostCenter = useBaseQuery(
    ["cost-center"],
    () => getCostCenter(startDate, endDate),
    {
      enabled: shouldFetch,
    }
  );

  return { getAllCostCenter };
};
