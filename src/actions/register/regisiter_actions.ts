import { dolibarrApi } from "../../api";
import { CategoryResponse, GeneralLabor, GeneralLaborResponse, ProductsResponse, RAFRegister, RAFSendData, SeedMapRegister, SeedMapRegisterInterface } from "../../interfaces";


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


export const getRAFByCropId = async (cropId: string) : Promise<RAFRegister[]> => {
    const response = await dolibarrApi.get(`/vicentina/register/raf/crop/${cropId}`);
    return response.data as RAFRegister[];
};

export const getListRAF = async () : Promise<RAFRegister[]> => {
    const response = await dolibarrApi.get('/vicentina/register/raf/list');
    return response.data as RAFRegister[];
};

export const getListSeedMap = async () : Promise<SeedMapRegister[]> => {
    const response = await dolibarrApi.get('/vicentina/register/seed-map/list');
    return response.data as SeedMapRegister[];
};


export const getListLabor = async () : Promise<GeneralLaborResponse[]> => {
    const response = await dolibarrApi.get('/vicentina/register/general-labor/list');
    return response.data as GeneralLaborResponse[];
};