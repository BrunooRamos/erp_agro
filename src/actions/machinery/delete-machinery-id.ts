import { dolibarrApi } from "../../api";

export const deleteMachineryId = async (id: string) => {
    const response = await dolibarrApi.delete(`/vicentina/machinery/delete/${id}`);
    return response.data;
};