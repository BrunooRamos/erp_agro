import { useQuery } from "@tanstack/react-query";
import { getWarehouse } from "../../actions/general/general.actions";

export const useERPInfo = () => {
    const { data: warehouses } = useQuery({
        queryKey: ['warehouses'],
        queryFn: getWarehouse,
    });

    return {
        warehouses,
    };
};
