import { dolibarrApi } from "../../api/dolibarr.api";
import { MovementForm } from "../../interfaces";


export const postCreateMovement = async (data: MovementForm) => {
    const response = await dolibarrApi.post('/vicentina/product/create-potato-variant', data);
    return response.data;
}