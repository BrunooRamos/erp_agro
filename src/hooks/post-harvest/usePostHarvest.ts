import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateCaliberForm, CreateTongCostForm, TongProccesForm } from "../../interfaces";
import { toast } from "react-toastify";
import { deleteTongCostById, getCalibers, getTongCosts, postCreateCaliber, postCreateTongCost, postCreateTongProcess, getTongProcesses } from "../../actions";


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

    return { createCaliber, listCalibers, createTongCost, listTongCosts, deleteTongCost, createTongProcess, listTongProcesses };
}