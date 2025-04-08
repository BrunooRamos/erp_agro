import { useQuery } from "@tanstack/react-query";
import { getCategoryIdByLabel } from "../../actions/register/regisiter_actions";

export const useGetCategoryByLabel = (
    label: string, 
) => {
    const { data, isLoading, error } = useQuery({
        queryKey: ["category", label],
        queryFn: () => getCategoryIdByLabel(label),
        staleTime: 10 * 60 * 1000,
    });

    return { data, isLoading, error };
};