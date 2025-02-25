import { dolibarrApi } from "../../api";
import { IrrigationFormInterface, IrrigationResponse } from "../../interfaces/irrigation.interface";

export const postCreateIrrigation = async (irrigation: IrrigationFormInterface) => {
    const response = await dolibarrApi.post('/vicentina/irrigation/create', irrigation);
    return response.data;
};

export const getIrrigationList = async () => {
    const response = await dolibarrApi.get('/vicentina/irrigation/list');
    return response.data as IrrigationResponse[];
};