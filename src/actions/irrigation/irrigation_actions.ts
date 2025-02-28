import { dolibarrApi } from "../../api";
import { IrrigationCostForm, IrrigationCostResponse, IrrigationFertirriegoSendData, IrrigationFormInterface, IrrigationHoursSendData, IrrigationInfoResponse, IrrigationResponse } from "../../interfaces";

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

export const postIrrigationHours = async (irrigationHours: IrrigationHoursSendData) => {
    const response = await dolibarrApi.post('/vicentina/irrigation/hours/create', irrigationHours);
    return response.data;
};

export const postIrrigationFertirriego = async (irrigationFertirriego: IrrigationFertirriegoSendData) => {
    const response = await dolibarrApi.post('/vicentina/irrigation/fertirriego/create', irrigationFertirriego);
    return response.data;
};


export const getIrrigationInfo = async (id: string) => {
    const response = await dolibarrApi.get(`/vicentina/irrigation/${id}`);
    return response.data as IrrigationInfoResponse;
};

export const deleteIrrigationHours = async (id: string) => {
    const response = await dolibarrApi.delete(`/vicentina/irrigation/hours/${id}`);
    return response.data;
};

export const deleteIrrigationFertirriegoProduct = async (id: string) => {
    console.log("estoy aqui", id);
    const response = await dolibarrApi.delete(`/vicentina/irrigation/product/${id}`);
    return response.data;
};

