import { dolibarrApi } from "../../api";
import { DepreciationCostForm, DepreciationList, OtherExpenseCostList, OtherExpensesCostForm } from "../../interfaces";


export const getCostCenter = async (startDate: string, endDate: string) => {
    const response = await dolibarrApi.get(`/vicentina/expenses/${startDate}/${endDate}`);
    return response.data;
}

export const createDepreciationCost = async (data: DepreciationCostForm) => {
    const response = await dolibarrApi.post("/vicentina/depreciation/create", data);
    return response.data;
}


export const getDepreciationList = async () : Promise<DepreciationList[]> => {
    const response = await dolibarrApi.get("/vicentina/depreciation/list");
    return response.data;
}

export const createOtherExpensesCost = async (data: OtherExpensesCostForm) => {
    const response = await dolibarrApi.post("/vicentina/other-expenses/create", data);
    return response.data;
}

export const getOtherExpensesCostList = async () : Promise<OtherExpenseCostList[]> => {
    const response = await dolibarrApi.get("/vicentina/other-expenses/list");
    return response.data;
}