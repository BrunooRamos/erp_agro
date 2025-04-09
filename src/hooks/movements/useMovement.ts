
import { LogisticCostForm, MovementForm } from "../../interfaces";
import { toast } from "react-toastify";
import { getLogisticCosts, postCreateLogisticCost, postCreateMovement } from "../../actions/index";
import { useBaseMutation } from "../config/useBaseMutation";
import { useBaseQuery } from "../config/useBaseQuery";


export const useMovement = () => {
    const createMovement = useBaseMutation(
        (data: MovementForm) => postCreateMovement(data),
        {
            onSuccess: () => {
                toast.success('Movimiento creado correctamente');
            },
        }
    );

    const createLogisticCost = useBaseMutation(
        (data: LogisticCostForm) => postCreateLogisticCost(data),
        {
            onSuccess: () => {
                toast.success('Costo logístico creado correctamente');
            },      
        }
    );

    const listLogisticCosts = useBaseQuery(
        ['logistic-costs'],
        getLogisticCosts,
    );


    return { createMovement, createLogisticCost, listLogisticCosts };
};
