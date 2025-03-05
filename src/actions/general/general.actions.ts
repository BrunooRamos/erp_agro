import { dolibarrApi, pricesApi } from "../../api";
import { WarehouseResponse, PriceResponse, PriceHistoricData } from "../../interfaces";

export const getWarehouse = async () => {
    const response = await dolibarrApi.get('/vicentina/warehouses/by-category');
    return response.data as WarehouseResponse[];
}

export const getPrices = async () => {
    const response = await pricesApi.get('/all');
    return response.data as PriceResponse[];
}

export const savePrices = async (prices: PriceResponse[]) => {
    const response = await dolibarrApi.post('/vicentina/prices/save', prices);
    return response.data;
}
export const getHistoricPrices = async (): Promise<PriceHistoricData> => {
    const response = await dolibarrApi.get('/vicentina/prices/historic');
    return response.data as PriceHistoricData;
}