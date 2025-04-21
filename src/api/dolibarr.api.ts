import axios from 'axios';

export const dolibarrApi = axios.create({
  baseURL: import.meta.env.VITE_DOLIBARR_URL,
});

dolibarrApi.interceptors.request.use((config) => {
  console.log('Estoy fuera del if');
  if (config.url !== '/login') {
    console.log('Estoy dentro del if');
    const dolibarrToken = localStorage.getItem('dolibarrToken');
    if (dolibarrToken) {
      config.headers['DOLAPIKEY'] = dolibarrToken;
    }
  }
  return config;
});
