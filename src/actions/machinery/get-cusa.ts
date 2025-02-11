
import { dolibarrApi } from "../../api";
import { CusaInfo } from "../../interfaces";

export const getCusa = async (): Promise<CusaInfo[]> => {
    const response = await dolibarrApi.get('/vicentina/cusa');
    const data = response.data.map((item: CusaInfo) => ({
        ...item,
        precio_cusa: isNaN(Number(item.precio_cusa)) ? 0 : Number(item.precio_cusa),
    }));
    return data;
}
