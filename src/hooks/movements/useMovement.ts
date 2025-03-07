import { useMutation, useQuery } from "@tanstack/react-query";
import { LogisticCostForm, MovementForm } from "../../interfaces";
import { toast } from "react-toastify";
import { getLogisticCosts, postCreateLogisticCost, postCreateMovement } from "../../actions/index";


export const useMovement = () => {
    const createMovement = useMutation({
        mutationFn: (data: MovementForm) => postCreateMovement(data),
        onSuccess: () => {
            toast.success('Movimiento creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el movimiento: ' + error);
        }
    });

    const createLogisticCost = useMutation({
        mutationFn: (data: LogisticCostForm) => postCreateLogisticCost(data),
        onSuccess: () => {
            toast.success('Costo logístico creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el costo logístico: ' + error);

        }

    });

    const listLogisticCosts = useQuery({
        queryKey: ['logistic-costs'],
        queryFn: () => getLogisticCosts(),
    });


    return { createMovement, createLogisticCost, listLogisticCosts };
};



