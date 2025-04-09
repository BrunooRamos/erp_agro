import { getPrices, getHistoricPrices, savePrices } from "../../actions/";
import { useBaseMutation, useBaseQuery } from "../index";

export const usePrices = () => {
    const getAllPrices = useBaseQuery(
        ['prices'],
        getPrices,
        {
            staleTime: 20 * 60 * 60 * 1000, // 20 horas en milisegundos
        }
    );

    const saveAllPrices = useBaseMutation(
        savePrices,
    );

    const historicPrices = useBaseQuery(
        ['historicPrices'],
        getHistoricPrices,
        {
            staleTime: 20 * 60 * 60 * 1000, // 20 horas en milisegundos
        }
    )

    return {
       getAllPrices,
       saveAllPrices,
       historicPrices
    };
}
