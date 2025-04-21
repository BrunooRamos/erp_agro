import { toast } from "react-toastify";
import { DepreciationCostForm, OtherExpensesCostForm } from "../../interfaces";
import { createDepreciationCost, createOtherExpensesCost, getDepreciationList, getOtherExpensesCostList } from "../../actions";
import { useBaseQuery,useBaseMutation } from "../index";


export const useExpenses = () => {

    const createDepreciation = useBaseMutation(
        (data: DepreciationCostForm) => createDepreciationCost(data),
        {   
            onSuccess: () => {
                toast.success("Depreciación creada exitosamente");
            },
        }
    );

    const listDepreciation = useBaseQuery(
        ["depreciation-list"],
        () => getDepreciationList(),
    );

    const createOtherExpenses = useBaseMutation(
        (data: OtherExpensesCostForm) => createOtherExpensesCost(data),
        {
            onSuccess: () => {
                toast.success("Gasto creado exitosamente");
            },
        }
    );

    const listOtherExpenses = useBaseQuery(
        ["other-expenses-list"],
        () => getOtherExpensesCostList(),
    );

  return { createDepreciation, listDepreciation, createOtherExpenses, listOtherExpenses };
};
