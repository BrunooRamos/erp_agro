import { dolibarrApi } from "../../api";
import { Caliber, CostWashForm, CostWashResponse, CreateCaliberForm, CreateQualityForm, CreateTongCostForm, TongCost, TongProccesForm, TongProcessResponse, WashProcessForm, WashQualityResponse } from "../../interfaces";

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


export const postCreateWashCost = async (data: CostWashForm) => {
  const response = await dolibarrApi.post("/vicentina/wash/cost/create", data);
  return response.data;
};

export const getWashCosts = async (): Promise<CostWashResponse[]> => {
  const response = await dolibarrApi.get("/vicentina/wash/costs/list");
  return response.data;
};


export const postCreateWashQuality = async (data: CreateQualityForm) => {
  const response = await dolibarrApi.post("/vicentina/wash/quality/create", data);
  return response.data;
};

export const getWashQualities = async (): Promise<WashQualityResponse[]> => {
  const response = await dolibarrApi.get("/vicentina/wash/quality/list");
  return response.data;
};

export const postCreateWashProcess = async (data: WashProcessForm) => {
  const response = await dolibarrApi.post("/vicentina/wash/process/create", data);
  return response.data;
};