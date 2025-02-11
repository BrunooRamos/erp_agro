import { dolibarrApi } from "../../api";
import { MachineryEntity } from "../../interfaces/index";


export const getListMachinery = async (): Promise<MachineryEntity[]> => {
    const response = await dolibarrApi.get('/vicentina/machinery/list');
    return response.data;
};