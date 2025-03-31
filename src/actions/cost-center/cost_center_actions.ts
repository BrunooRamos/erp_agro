import { dolibarrApi } from "../../api";


export const getCostCenter = async (startDate: string, endDate: string) => {
    const response = await dolibarrApi.get(`/vicentina/expenses/${startDate}/${endDate}`);
    return response.data;
}