import { onLogin, onCheckingCredentials, onLogout } from "./authSlice";
import { ErrorAuthResponse, LoginUserProps, SuccessLoginResponse } from "../../interfaces/index";
import { AppDispatch } from "../store";
import { postLoginAction } from "../../actions";
import { AxiosError } from "axios";
import { generateCustomToken } from "../../helpers";



export const startLoginWithEmailPassword = ({ user, password }: LoginUserProps) => {
    return async ( dispatch: AppDispatch ) => {
        dispatch( onCheckingCredentials() );

        try {
            const response = await postLoginAction({ user, password });
            const data = response.data.success as SuccessLoginResponse ;

            const { expiresAt } = generateCustomToken();

            localStorage.setItem("dolibarrToken", data.token);
            localStorage.setItem("dataExpiration", expiresAt.toString());
            localStorage.setItem("displayName", data.message.split(' ')[1]);
            localStorage.setItem("entity", data.entity);

            

            dispatch( onLogin( data ) );
        } catch (error: unknown) {
            const errorResponse = (error as AxiosError).response?.data as ErrorAuthResponse;
            
            const errorMessage = errorResponse?.error?.message || 'An error occurred';
            dispatch( onLogout({ errorMessage }) );
        }
    }
}



