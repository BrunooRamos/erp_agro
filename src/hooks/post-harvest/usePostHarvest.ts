import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateCaliberForm, CreateTongCostForm, TongProccesForm, CostWashForm, CreateQualityForm, WashProcessForm } from "../../interfaces";
import { toast } from "react-toastify";
import { deleteTongCostById, getCalibers, getTongCosts, postCreateCaliber, postCreateTongCost, postCreateTongProcess, getTongProcesses, postCreateWashCost, getWashCosts, postCreateWashQuality, getWashQualities, postCreateWashProcess } from "../../actions";


export const usePostHarvest = () => {
    const createCaliber = useMutation({
        mutationFn: (data: CreateCaliberForm) => postCreateCaliber(data),
        onSuccess: () => {
            toast.success('Calibre creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el calibre: ' + error);
        }
    });

    const listCalibers = useQuery({
        queryKey: ['calibers'],
        queryFn: () => getCalibers(),
    });

    const createTongCost = useMutation({
        mutationFn: (data: CreateTongCostForm) => postCreateTongCost(data),
        onSuccess: () => {
            toast.success('Costo de tong creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el costo de tong: ' + error);
        }
    });

    const listTongCosts = useQuery({
        queryKey: ['tongCosts'],
        queryFn: () => getTongCosts(),
    });

    const deleteTongCost = useMutation({
        mutationFn: (id: string) => deleteTongCostById(id),
        onSuccess: () => {
            toast.success('Costo de tong eliminado correctamente');
        },
        onError: (error) => {
            toast.error('Error al eliminar el costo de tong: ' + error);
        }
    });

    const createTongProcess = useMutation({
        mutationFn: (data: TongProccesForm) => postCreateTongProcess(data),
        onSuccess: () => {
            toast.success('Proceso de tong creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el proceso de tong: ' + error);
        }
    });

    const listTongProcesses = useQuery({
        queryKey: ['tongProcesses'],
        queryFn: () => getTongProcesses(),
    });

    const createWashCost = useMutation({
        mutationFn: (data: CostWashForm) => postCreateWashCost(data),
        onSuccess: () => {
            toast.success('Costo de lavado creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el costo de lavado: ' + error);
        }
    });

    const listWashCosts = useQuery({
        queryKey: ['washCosts'],
        queryFn: () => getWashCosts(),
    });

    const createWashQuality = useMutation({
        mutationFn: (data: CreateQualityForm) => postCreateWashQuality(data),
        onSuccess: () => {
            toast.success('Calidad de lavado creada correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear la calidad de lavado: ' + error);
        }
    });

    const listWashQualities = useQuery({
        queryKey: ['washQualities'],
        queryFn: () => getWashQualities(),
    }); 

    const createWashProcess = useMutation({
        mutationFn: (data: WashProcessForm) => postCreateWashProcess(data),
        onSuccess: () => {
            toast.success('Proceso de lavado creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el proceso de lavado: ' + error);
        }
    });

    return { createCaliber, listCalibers, createTongCost, listTongCosts, deleteTongCost, createTongProcess, listTongProcesses, createWashCost, listWashCosts, createWashQuality, listWashQualities, createWashProcess };
}