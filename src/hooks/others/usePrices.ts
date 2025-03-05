import { useMutation, useQuery } from "@tanstack/react-query";
import { getPrices, savePrices, getHistoricPrices } from "../../actions/";

export const usePrices = () => {
    const getAllPrices = useQuery({
        queryKey: ['prices'],
        queryFn: getPrices,
        staleTime: 20 * 60 * 60 * 1000, // 20 horas en milisegundos
    });

    const saveAllPrices = useMutation({
        mutationFn: savePrices,
    });

    const historicPrices = useQuery({
        queryKey: ['historicPrices'],
        queryFn: getHistoricPrices,
        staleTime: 20 * 60 * 60 * 1000, // 20 horas en milisegundos
    })

    return {
       getAllPrices,
       saveAllPrices,
       historicPrices
    };
}
