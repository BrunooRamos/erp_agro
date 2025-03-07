import { dolibarrApi } from "../../api";
import { Caliber, CreateCaliberForm } from "../../interfaces";

export const postCreateCaliber = async (data: CreateCaliberForm) => {
  const response = await dolibarrApi.post("/vicentina/post-harvest/caliber", data);
  return response.data;
};

export const getCalibers = async (): Promise<Caliber[]> => {
  const response = await dolibarrApi.get("/vicentina/post-harvest/caliber");
  return response.data;
};
