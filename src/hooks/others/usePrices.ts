import { getHistoricPrices } from "../../actions/";
import { useBaseQuery } from "../index";

export const usePrices = () => {
    const historicPrices = useBaseQuery(
        ['historicPrices'],
        getHistoricPrices,
        {
            staleTime: 20 * 60 * 60 * 1000, // 20 horas en milisegundos
        }
    )

    return {
       historicPrices
    };
}
