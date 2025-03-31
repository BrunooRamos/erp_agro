import { MachineryEntity, CusaInfo, MachineryForm } from "../../interfaces";
import { dolibarrApi } from "../../api";
import { filterMachineryUpdateFields } from "../../helpers";

export const deactivateMachineryId = async (id: string) => {
    const response = await dolibarrApi.delete(`/vicentina/machinery/deactivate/${id}`);
    return response.data;
};


export const getByIdMachinery = async (code: string): Promise<MachineryEntity> => {
    const response = await dolibarrApi.get<MachineryEntity>(`/vicentina/machinery/get/${code}`);

    return response.data;
};


export const getCusa = async (): Promise<CusaInfo[]> => {
    const response = await dolibarrApi.get('/vicentina/cusa');
    const data = response.data.map((item: CusaInfo) => ({
        ...item,
        precio_cusa: isNaN(Number(item.precio_cusa)) ? 0 : Number(item.precio_cusa),
    }));
    return data;
}

export const getListMachinery = async (): Promise<MachineryEntity[]> => {
    const response = await dolibarrApi.get('/vicentina/machinery/list');
    return response.data;
};

export const postCreateMachinery = async (machinery: MachineryForm) => {
    const response = await dolibarrApi.post('/vicentina/machinery/create', machinery);
    return response.data;
};
export const putUpdateMachinery = async (code: string, machinery: MachineryForm) => {
    const filteredData = filterMachineryUpdateFields(machinery);
    const response = await dolibarrApi.put(`/vicentina/machinery/update/${code}`, filteredData);
    return response.data;
};