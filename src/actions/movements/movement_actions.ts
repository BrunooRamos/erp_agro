import { dolibarrApi } from "../../api/dolibarr.api";
import { LogisticCostForm, LogisticCostResponse, MouvementsHistoric, MovementForm, SublotResponse } from "../../interfaces";


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

export const getPotateoHarvest = async (cropCode: string): Promise<MouvementsHistoric[]> => {
    const response = await dolibarrApi.get(`/vicentina/potato-harvest/crop/${cropCode}`);
    return response.data;
}

export const getSublotsByLot = async (crop_id: string, lot: string): Promise<SublotResponse[]> => {
    const response = await dolibarrApi.get(`/vicentina/sublots/crop/${crop_id}/lot/${lot}`);
    return response.data;
}