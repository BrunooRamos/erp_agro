import { dolibarrApi } from "../../api/dolibarr.api";
import { LogisticCostForm, LogisticCostResponse, MovementForm } from "../../interfaces";


export const postCreateMovement = async (data: MovementForm) => {
    const response = await dolibarrApi.post('/vicentina/product/create-potato-variant', data);
    return response.data;
}

export const postCreateLogisticCost = async (data: LogisticCostForm) => {
    const response = await dolibarrApi.post('/vicentina/logistic-cost/create', data);
    return response.data;
}

export const getLogisticCosts = async (): Promise<LogisticCostResponse[]> => {
    const response = await dolibarrApi.get('/vicentina/logistic-cost/list');
    return response.data;
}