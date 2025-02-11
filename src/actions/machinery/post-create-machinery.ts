import { dolibarrApi } from "../../api";
import { MachineryForm } from "../../interfaces";

export const postCreateMachinery = async (machinery: MachineryForm) => {
    const response = await dolibarrApi.post('/vicentina/machinery/create', machinery);
    return response.data;
};
