import { dolibarrApi } from "../../api";
import { MachineryForm } from "../../interfaces";
import { filterMachineryUpdateFields } from "../../helpers";

export const putUpdateMachinery = async (code: string, machinery: MachineryForm) => {
    const filteredData = filterMachineryUpdateFields(machinery);
    const response = await dolibarrApi.put(`/vicentina/machinery/update/${code}`, filteredData);
    return response.data;
};