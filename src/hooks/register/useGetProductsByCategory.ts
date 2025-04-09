import { useBaseQuery, useGetCategoryByLabel } from "..";
import { getProductsByCategoryId } from "../../actions";

export const useGetProductsByCategory = (shouldFetch: boolean, category: string) => {
    const { data: categoryData } = useGetCategoryByLabel(category);
    const categoryId = categoryData?.rowid.toString();

    const { data, isLoading, error } = useBaseQuery(
        ["products", categoryId ?? ''],
        () => categoryId ? getProductsByCategoryId(categoryId) : Promise.reject('No category ID'),
        {
            enabled: !!categoryId && shouldFetch
        }
    );

    if (!categoryId) return { data: null, isLoading: false, error: null };

    return { 
        data, 
        isLoading, 
        error,
        categories: categoryData
    };
};