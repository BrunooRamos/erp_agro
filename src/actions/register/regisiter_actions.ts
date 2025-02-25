import { dolibarrApi } from "../../api";
import { CategoryResponse, GeneralLabor, MapSeedGetResponse, ProductsResponse, RafRegister, RAFSendData, SeedMapRegisterInterface } from "../../interfaces";


export const getCategoryIdByLabel = async (label: string) => {
    const response = await dolibarrApi.get(`/categories/label/${label}`);
    return response.data as CategoryResponse;
};

export const getProductsByCategoryId = async (categoryId: string) => {
    const response = await dolibarrApi.get(`/categories/${categoryId}/products/tree`);
    return response.data as ProductsResponse[];
};

export const postCreateRAF = async (field: RAFSendData) => {
    const response = await dolibarrApi.post('/vicentina/register/raf/create', field);
    return response.data;
};

export const postCreateSeedMap = async (field: SeedMapRegisterInterface) => {
    const response = await dolibarrApi.post('/vicentina/register/seedmap/create', field);
    return response.data;
};

export const postCreateGeneralLabor = async (field: GeneralLabor) => {
    const response = await dolibarrApi.post('/vicentina/register/general-labor/create', field);
    return response.data;
};


export const getRAFByCropId = async (cropId: string) : Promise<RafRegister[]> => {
    const response = await dolibarrApi.get(`/vicentina/register/raf/crop/${cropId}`);
    return response.data as RafRegister[];
};

export const getListRAF = async () : Promise<RafRegister[]> => {
    const response = await dolibarrApi.get('/vicentina/register/raf/list');
    return response.data as RafRegister[];
};

export const getListSeedMap = async () : Promise<MapSeedGetResponse[]> => {
    const response = await dolibarrApi.get('/vicentina/register/seed-map/list');
    return response.data as MapSeedGetResponse[];
};


export const getListLabor = async () : Promise<GeneralLabor[]> => {
    const response = await dolibarrApi.get('/vicentina/register/general-labor/list');
    return response.data as GeneralLabor[];
};