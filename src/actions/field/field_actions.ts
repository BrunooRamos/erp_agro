import { dolibarrApi } from "../../api";
import { FieldForm, FieldEntity, LotEntity } from "../../interfaces";

export const putUpdateField = async (code: string, field: FieldForm) => {
    const response = await dolibarrApi.put(`/vicentina/field/update/${code}`, field);
    return response.data;
};

export const postCreateField = async (field: FieldForm) => {
    const response = await dolibarrApi.post('/vicentina/field/create', field);
    return response.data;
};

export const getListField = async (): Promise<FieldEntity[]> => {
    const response = await dolibarrApi.get('/vicentina/field/list');
    return response.data;
}; 

export const getByIdField = async (code: string) => {
    const response = await dolibarrApi.get(`/vicentina/field/get/${code}`);
    return response.data;
};

export const deleteField = async (id: string) => {
    const response = await dolibarrApi.delete(`/vicentina/field/delete/${id}`);
    return response.data;
}; 

export const getMapField = async () => {
    const response = await dolibarrApi.get('/vicentina/field/map');
    return response.data;
};

export const getLotByField = async (field: string): Promise<LotEntity[]> => {
    const response = await dolibarrApi.get(`/vicentina/field/${field}/lots`);
    return response.data;
};

