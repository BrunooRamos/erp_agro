import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './../index';
import { onLogin, onLogout } from '../../store/auth/authSlice';


export const useCheckAuth = () => {
  
    const { status } = useAppSelector( state => state.auth );
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkTokenExpiration = () => {
            const expirationTime = localStorage.getItem('dataExpiration');

            if (!expirationTime) {
                dispatch(onLogout({ errorMessage: null }));
                return;
            }

            const isExpired = Date.now() > parseInt(expirationTime);
            
            if (isExpired) {
                localStorage.removeItem('dolibarrToken');
                localStorage.removeItem('dataExpiration');
                localStorage.removeItem('displayName');
                localStorage.removeItem('entity');
                dispatch(onLogout({ errorMessage: 'Session expired. Please login again.' }));
                return;
            }

            dispatch(onLogin({ 
                entity: localStorage.getItem('entity'), 
                displayName: localStorage.getItem('displayName') 
            }));
        };

        checkTokenExpiration();
        
        // Check token expiration every 10 minutes
        const interval = setInterval(checkTokenExpiration, 60000 * 10);

        return () => clearInterval(interval);
    }, [dispatch]);

    return status;
}