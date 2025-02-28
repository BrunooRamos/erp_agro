import { useMutation, useQuery } from "@tanstack/react-query"
import { IrrigationCostForm, IrrigationFertirriegoSendData, IrrigationFormInterface, IrrigationHoursSendData } from "../../interfaces"
import { toast } from "react-toastify";
import { postCreateIrrigation, getIrrigationList, getIrrigationCosts, postIrrigationCosts, postIrrigationHours, postIrrigationFertirriego, getIrrigationInfo, deleteIrrigationHours, deleteIrrigationFertirriegoProduct } from "../../actions/index";


export const useIrrigation = (id?: string) => {

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

    const createIrrigationHours = useMutation({
        mutationFn: (irrigationHours: IrrigationHoursSendData) => postIrrigationHours(irrigationHours),
        onSuccess: () => {
            toast.success('Horas de riego creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear las horas de riego: ' + error);
        }
    })

    const createIrrigationFertirriego = useMutation({
        mutationFn: (irrigationFertirriego: IrrigationFertirriegoSendData) => postIrrigationFertirriego(irrigationFertirriego),
        onSuccess: () => {
            toast.success('Fertirriego creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el fertirriego: ' + error);
        }
    })

    const irrigationInfo = useQuery({
        queryKey: ['irrigationInfo'],
        enabled: !!id,
        queryFn: () => {
            if (id) return getIrrigationInfo(id);
            return null;
        }
    })

    const irrigationDeleteHours = useMutation({
        mutationFn: (id: string) => deleteIrrigationHours(id),
        onSuccess: () => {
            toast.success('Horas de riego eliminadas correctamente');
        },
        onError: (error) => {
            toast.error('Error al eliminar las horas de riego: ' + error);
        }
    })

    const irrigationDeleteFertirriegoProduct = useMutation({
        mutationFn: (id: string) => deleteIrrigationFertirriegoProduct(id),
        onSuccess: () => {
            toast.success('Producto de fertirriego eliminado correctamente');
        },
        onError: (error) => {
            toast.error('Error al eliminar el producto de fertirriego: ' + error);
        }
    })

    return { createIrrigation, irrigationList, irrigationCosts, createIrrigationCosts, createIrrigationHours, createIrrigationFertirriego, irrigationInfo, irrigationDeleteHours, irrigationDeleteFertirriegoProduct };
}