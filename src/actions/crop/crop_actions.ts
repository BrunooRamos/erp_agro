import { dolibarrApi } from "../../api";
import { CropEntity, CropForm, CropWithLot, LotEntity, VarietyEntity } from "../../interfaces";

export const postCreateCrop = async (crop: CropForm) => {
    const response = await dolibarrApi.post('/vicentina/crop/create', crop);
    return response.data;
};

export const putUpdateCrop = async (code: string, crop: CropForm) => {
    const response = await dolibarrApi.put(`/vicentina/crop/update/${code}`, crop);
    return response.data;
};

export const getByIdCrop = async (rowid: string) => {
    const response = await dolibarrApi.get(`/vicentina/crop/get/${rowid}`);
    return response.data as CropWithLot;
};


export const getListCrop = async (): Promise<CropEntity[]> => {
    const response = await dolibarrApi.get('/vicentina/crop/list');
    return response.data;
}; 

export const deleteCrop = async (code: string) => {
    const response = await dolibarrApi.delete(`/vicentina/crop/delete/${code}`);
    return response.data;
};

export const getLotsByCrop = async (code: string) : Promise<LotEntity[]> => {
    const response = await dolibarrApi.get(`/vicentina/crop/${code}/lots`);
    return response.data;
};

export const getVarietiesByCrop = async (crop_code: string) : Promise<VarietyEntity[]> => {
    const response = await dolibarrApi.get(`/vicentina/crop/${crop_code}/potato-varieties`);
    return response.data as VarietyEntity[];
};