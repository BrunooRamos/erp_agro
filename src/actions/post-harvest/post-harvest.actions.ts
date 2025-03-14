import { dolibarrApi } from "../../api";
import { Caliber, CreateCaliberForm, CreateTongCostForm, TongCost, TongProccesForm, TongProcessResponse } from "../../interfaces";

export const postCreateCaliber = async (data: CreateCaliberForm) => {
  const response = await dolibarrApi.post("/vicentina/tong/caliber", data);
  return response.data;
};

export const getCalibers = async (): Promise<Caliber[]> => {
  const response = await dolibarrApi.get("/vicentina/tong/caliber");
  return response.data;
};


export const postCreateTongCost = async (data: CreateTongCostForm) => {
  const response = await dolibarrApi.post("/vicentina/tong/cost/create", data);
  return response.data;
};

export const getTongCosts = async (): Promise<TongCost[]> => {
  const response = await dolibarrApi.get("/vicentina/tong/costs");
  return response.data;
};

export const deleteTongCostById = async (costId: string) => {
  const response = await dolibarrApi.delete(`/vicentina/tong/cost/delete/${costId}`);
  return response.data;
};

export const postCreateTongProcess = async (data: TongProccesForm) => {
  const response = await dolibarrApi.post("/vicentina/tong/process/create", data);
  return response.data;
};

export const getTongProcesses = async (): Promise<TongProcessResponse[]> => {
  const response = await dolibarrApi.get("/vicentina/tong/processes");
  return response.data as TongProcessResponse[];
};


