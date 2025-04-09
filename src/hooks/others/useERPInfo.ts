import { getWarehouse } from "../../actions/general/general.actions";
import { useBaseQuery } from "../index";

export const useERPInfo = () => {
    const { data: warehouses } = useBaseQuery(
        ['warehouses'],
        getWarehouse,
    );

    return {
        warehouses,
    };
};
