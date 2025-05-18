import axios from 'axios';
import { decryptData } from '../helpers';

export const dolibarrApi = axios.create({
  baseURL: import.meta.env.VITE_DOLIBARR_URL,
});

dolibarrApi.interceptors.request.use((config) => {
  if (config.url !== '/login') {
    // Obtener y desencriptar el token almacenado
    const encryptedToken = localStorage.getItem('secureDolibarrToken');
    if (encryptedToken) {
      try {
        const token = decryptData(encryptedToken);
        config.headers['DOLAPIKEY'] = token;
      } catch (error) {
        console.error('Error decrypting token', error);
        // Limpiar token inválido
        localStorage.removeItem('secureDolibarrToken');
      }
    }
  }
  return config;
});
