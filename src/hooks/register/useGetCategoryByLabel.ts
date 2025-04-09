import { getCategoryIdByLabel } from "../../actions/register/regisiter_actions";
import { useBaseQuery } from "../config/useBaseQuery";

export const useGetCategoryByLabel = (
    label: string, 
) => {
    const { data, isLoading, error } = useBaseQuery(
        ["category", label],
        () => getCategoryIdByLabel(label),
        {
            staleTime: 10 * 60 * 1000,
        }
    );

    return { data, isLoading, error };
};