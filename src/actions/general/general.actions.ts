import { dolibarrApi } from "../../api";
import { WarehouseResponse, PriceHistoricData } from "../../interfaces";

export const getWarehouse = async () => {
    const response = await dolibarrApi.get('/vicentina/warehouses/by-category');
    return response.data as WarehouseResponse[];
}
export const getHistoricPrices = async (): Promise<PriceHistoricData> => {
    const response = await dolibarrApi.get('/vicentina/prices/historic');
    return response.data as PriceHistoricData;
}