import { dolibarrApi } from "../../api";
import { LotForm, LotEntity } from "../../interfaces";

export const putUpdateLot = async (code: string, lot: LotForm) => {
    const response = await dolibarrApi.put(`/vicentina/lot/update/${code}`, lot);
    return response.data;
};

export const postCreateLot = async (lot: LotForm) => {
    const response = await dolibarrApi.post('/vicentina/lot/create', lot);
    return response.data;
};

export const getListLot = async (): Promise<LotEntity[]> => {
    const response = await dolibarrApi.get('/vicentina/lot/list');
    return response.data;
}; 

export const getByIdLot = async (code: string) => {
    const response = await dolibarrApi.get(`/vicentina/lot/get/${code}`);
    return response.data;
};

export const deleteLot = async (id: string) => {
    const response = await dolibarrApi.delete(`/vicentina/lot/delete/${id}`);
    return response.data;
}; 

export const getMapLot = async () => {
    const response = await dolibarrApi.get('/vicentina/lot/map');
    return response.data;
};

