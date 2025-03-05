import axios from "axios";

export const pricesApi = axios.create({
    baseURL: import.meta.env.VITE_PRICES_URL,
  });
  
  pricesApi.interceptors.request.use((config) => {
    return config;
  });