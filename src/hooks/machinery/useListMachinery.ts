import { getListMachinery } from "../../actions/index";
import { useQuery } from "@tanstack/react-query";


export const useListMachinery = () => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['machinery-list'],
        queryFn: getListMachinery,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    return { data, isLoading, error, refetch };
};