import { useQuery } from "@tanstack/react-query";
import { useGetCategoryByLabel } from "..";
import { getProductsByCategoryId } from "../../actions";

export const useGetProductsByCategory = ( shouldFetch: boolean, category: string ) => {
    const { data: categoryData } = useGetCategoryByLabel(category);
    const categoryId = categoryData?.id.toString();

    const { data, isLoading, error } = useQuery({
        queryKey: ["products", categoryId],
        queryFn: () => getProductsByCategoryId(categoryId!),
        enabled: !!categoryId && shouldFetch
    });

    if (!categoryId) return { data: null, isLoading: false, error: null };

    return { data, isLoading, error };
}