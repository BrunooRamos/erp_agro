import { dolibarrApi } from "../../api";
import { IrrigationCostForm, IrrigationCostResponse, IrrigationFormInterface, IrrigationResponse } from "../../interfaces";

export const postCreateIrrigation = async (irrigation: IrrigationFormInterface) => {
    const response = await dolibarrApi.post('/vicentina/irrigation/create', irrigation);
    return response.data;
};

export const getIrrigationList = async () => {
    const response = await dolibarrApi.get('/vicentina/irrigation/list');
    return response.data as IrrigationResponse[];
};

export const getIrrigationCosts = async (): Promise<IrrigationCostResponse[]> => { 
    const response = await dolibarrApi.get('/vicentina/irrigation/cost/list');
    return response.data as IrrigationCostResponse[];
};

export const postIrrigationCosts = async (irrigationCost: IrrigationCostForm) => {
    const response = await dolibarrApi.post('/vicentina/irrigation/cost/create', irrigationCost);
    return response.data;
};