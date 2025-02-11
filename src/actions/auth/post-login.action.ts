import { dolibarrApi } from "../../api";
import { LoginUserProps } from "../../interfaces/index";

export const postLoginAction = async ( { user, password }: LoginUserProps ) => {

    const body = {
        login: user,
        password: password
    }

    const response = await dolibarrApi.post('/login', body);

    return response;
}