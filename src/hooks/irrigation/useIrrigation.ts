import { useMutation, useQuery } from "@tanstack/react-query"
import { IrrigationCostForm, IrrigationFormInterface } from "../../interfaces"
import { toast } from "react-toastify";
import { postCreateIrrigation, getIrrigationList, getIrrigationCosts, postIrrigationCosts } from "../../actions/index";


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

    const createIrrigationCosts = useMutation({
        mutationFn: (irrigationCost: IrrigationCostForm) => postIrrigationCosts(irrigationCost),
        onSuccess: () => {
            toast.success('Costo de riego creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el costo de riego: ' + error);
        }
    })

    const irrigationCosts = useQuery({
        queryKey: ['irrigationCosts'],
        queryFn: () => getIrrigationCosts(),
    })

    return { createIrrigation, irrigationList, irrigationCosts, createIrrigationCosts };
}