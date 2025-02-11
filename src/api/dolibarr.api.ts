import axios from 'axios';

export const dolibarrApi = axios.create({
  baseURL: import.meta.env.VITE_DOLIBARR_URL,
});

dolibarrApi.interceptors.request.use((config) => {
  if (config.url !== '/login') {
    const dolibarrToken = localStorage.getItem('dolibarrToken');
    if (dolibarrToken) {
      config.headers['DOLAPIKEY'] = dolibarrToken;
    }
  }
  return config;
});