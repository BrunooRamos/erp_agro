import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './../index';
import { onLogin, onLogout } from '../../store/auth/authSlice';
import { dolibarrApi } from '../../api';

export const useCheckAuth = () => {
  
    const { status } = useAppSelector( state => state.auth );
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkAuthStatus = async () => {
            // Verificar si hay token en localStorage
            const encryptedToken = localStorage.getItem('secureDolibarrToken');
            if (!encryptedToken) {
                dispatch(onLogout({ errorMessage: null }));
                return;
            }

            // Verificar si el token ha expirado
            const expirationTime = localStorage.getItem('dataExpiration');
            if (expirationTime && Date.now() > parseInt(expirationTime)) {
                // Limpiar localStorage
                localStorage.removeItem('secureDolibarrToken');
                localStorage.removeItem('dataExpiration');
                localStorage.removeItem('displayName');
                localStorage.removeItem('entity');
                
                dispatch(onLogout({ errorMessage: 'Session expired. Please login again.' }));
                return;
            }

            try {
                // Intentar hacer una petición simple para verificar si el token es válido
                await dolibarrApi.get('/vicentina/register/raf/list', { 
                    params: { limit: 1 } // Limitar a un solo resultado para que sea liviano
                });
                
                // Si llegamos aquí, el token es válido
                dispatch(onLogin({ 
                    entity: localStorage.getItem('entity'), 
                    displayName: localStorage.getItem('displayName') 
                }));
            } catch (error) {
                // Si hay error, limpiar localStorage
                localStorage.removeItem('secureDolibarrToken');
                localStorage.removeItem('dataExpiration');
                localStorage.removeItem('displayName');
                localStorage.removeItem('entity');
                
                dispatch(onLogout({ errorMessage: 'Session expired. Please login again.' }));
            }
        };

        checkAuthStatus();
        
        // Verificar la sesión cada 10 minutos
        const interval = setInterval(checkAuthStatus, 60000 * 10);

        return () => clearInterval(interval);
    }, [dispatch]);

    return status;
}