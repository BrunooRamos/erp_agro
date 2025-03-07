import { useMutation, useQuery } from "@tanstack/react-query";
import { CreateCaliberForm } from "../../interfaces";
import { toast } from "react-toastify";
import { getCalibers, postCreateCaliber } from "../../actions";


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

    return { createCaliber, listCalibers };
}