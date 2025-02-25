import { useMutation, useQuery } from "@tanstack/react-query"
import { IrrigationFormInterface } from "../../interfaces/irrigation.interface"
import { toast } from "react-toastify";
import { postCreateIrrigation, getIrrigationList } from "../../actions/index";


export const useIrrigation = () => {

    const createIrrigation = useMutation({
        mutationFn: (irrigation: IrrigationFormInterface) => postCreateIrrigation(irrigation),
        onSuccess: () => {
            toast.success('Riego creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el riego: ' + error);
        }
    })


    const irrigationList = useQuery({
        queryKey: ['irrigationList'],
        queryFn: () => getIrrigationList(),
    })

    return { createIrrigation, irrigationList };
}