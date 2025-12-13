import { LogisticCostForm, MovementForm } from "../../interfaces";
import { toast } from "react-toastify";
import { getLogisticCosts, postCreateLogisticCost, postCreateMovement, getPotateoHarvest } from "../../actions/index";
import { useBaseMutation } from "../config/useBaseMutation";
import { useBaseQuery } from "../config/useBaseQuery";


export const useMovement = (cropCode?: string) => {
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


    const listPotateoHarvest = useBaseQuery(
        ['potateo-harvest', cropCode || ''],
        () => getPotateoHarvest(cropCode!),
        {
            enabled: !!cropCode,
        }
    );


    return { createMovement, createLogisticCost, listLogisticCosts, listPotateoHarvest };
};
