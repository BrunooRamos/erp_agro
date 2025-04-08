import { useQuery } from "@tanstack/react-query";
import { getCostCenter } from "../../actions/cost-center/cost_center_actions";

export const useCostCenter = (startDate: string, endDate: string, shouldFetch: boolean = false) => {
    const getAllCostCenter = useQuery({
        queryKey: ['cost-center'],
        queryFn: () => getCostCenter(startDate, endDate),
        enabled: shouldFetch
    });

    return { getAllCostCenter };
}
