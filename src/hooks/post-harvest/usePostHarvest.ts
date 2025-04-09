import { CreateCaliberForm, CreateTongCostForm, TongProccesForm, CostWashForm, CreateQualityForm, WashProcessForm } from "../../interfaces";
import { toast } from "react-toastify";
import { deleteTongCostById, getCalibers, getTongCosts, postCreateCaliber, postCreateTongCost, postCreateTongProcess, getTongProcesses, postCreateWashCost, getWashCosts, postCreateWashQuality, getWashQualities, postCreateWashProcess } from "../../actions";
import { useBaseMutation, useBaseQuery } from "../";


export const usePostHarvest = () => {
    const createCaliber = useBaseMutation(
        (data: CreateCaliberForm) => postCreateCaliber(data),
        {
            onSuccess: () => {
                toast.success('Calibre creado correctamente');
            },
        }
    );


    const listCalibers = useBaseQuery(
       ['calibers'],
        getCalibers
    );

    const createTongCost = useBaseMutation(
        (data: CreateTongCostForm) => postCreateTongCost(data),
        {
            onSuccess: () => {
                toast.success('Costo de tong creado correctamente');
            },
        }
    );

    const listTongCosts = useBaseQuery(
        ['tongCosts'],
        getTongCosts
    );

    const deleteTongCost = useBaseMutation(
        (id: string) => deleteTongCostById(id),
        {
            onSuccess: () => {
                toast.success('Costo de tong eliminado correctamente');
            },
        }
    );

    const createTongProcess = useBaseMutation(
        (data: TongProccesForm) => postCreateTongProcess(data),
        {
            onSuccess: () => {
                toast.success('Proceso de tong creado correctamente');
            },
        }
    );

    const listTongProcesses = useBaseQuery(
        ['tongProcesses'],
        getTongProcesses
    );

    const createWashCost = useBaseMutation(
        (data: CostWashForm) => postCreateWashCost(data),
        {
            onSuccess: () => {
                toast.success('Costo de lavado creado correctamente');
            },
        }
    );

    const listWashCosts = useBaseQuery(
        ['washCosts'],
        getWashCosts
    );

    const createWashQuality = useBaseMutation(
        (data: CreateQualityForm) => postCreateWashQuality(data),
        {
            onSuccess: () => {
                toast.success('Calidad de lavado creada correctamente');
            },
        }
    );

    const listWashQualities = useBaseQuery(
        ['washQualities'],
        getWashQualities
    );

    const createWashProcess = useBaseMutation(
        (data: WashProcessForm) => postCreateWashProcess(data),
        {
            onSuccess: () => {
                toast.success('Proceso de lavado creado correctamente');
            },
        }
    );

    return { createCaliber, listCalibers, createTongCost, listTongCosts, deleteTongCost, createTongProcess, listTongProcesses, createWashCost, listWashCosts, createWashQuality, listWashQualities, createWashProcess };
}