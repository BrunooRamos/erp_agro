import { dolibarrApi } from "../../api";
import { WarehouseResponse } from "../../interfaces";

export const getWarehouse = async () => {
    const response = await dolibarrApi.get('/vicentina/warehouses/by-category');
    return response.data as WarehouseResponse[];
}

