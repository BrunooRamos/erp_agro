import { dolibarrApi } from "../../api";
import { MachineryEntity } from "../../interfaces";

export const getByIdMachinery = async (code: string): Promise<MachineryEntity> => {
    const response = await dolibarrApi.get<MachineryEntity[]>(`/vicentina/machinery/get/${code}`);
    return response.data[0];
};
