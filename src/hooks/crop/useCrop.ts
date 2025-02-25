import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { CropForm } from "../../interfaces";
import { getByIdCrop, postCreateCrop, deleteCrop as deleteCropAction, putUpdateCrop, getListCrop, getLotsByCrop, getVarietiesByCrop } from "../../actions";


export const useCrop = ( code?: string, rowid?: string ) => {
    const queryClient = useQueryClient();

    const createCrop = useMutation({
        mutationFn: (crop: CropForm) => postCreateCrop(crop),
        onSuccess: () => {
          toast.success('Lote de campo creado correctamente');
        },
        onError: (error) => {
          toast.error('Error al crear el lote de campo: ' + error);
        }
    });


    const getCrop = useQuery({
        queryKey: ['crop', code],
        queryFn: () => getByIdCrop(code!),
        enabled: !!code, // Only run query if code exists
    });

    const deleteCrop = useMutation({
        mutationFn: deleteCropAction,
        onSuccess: () => {
            toast.success('Lote de campo eliminado correctamente');
        },
        onError: (error) => {
            toast.error('Error al eliminar el cultivo: ' + error);
        }
    });

    const updateCrop = useMutation({
        mutationFn: ({ code, data }: { code: string; data: CropForm }) => 
            putUpdateCrop(code, data),
        onSuccess: () => {
            // Invalidate and refetch the machinery list
            queryClient.invalidateQueries({ queryKey: ['field-lot-list'] });
            toast.success('Lote de campo actualizado exitosamente');
        },
        onError: (error) => {
            toast.error('Error al actualizar el lote de campo: ' + error?.message);
            console.error('Error updating field lot:', error);
        }
    });

    const getLotsByCropId = useQuery({
        queryKey: ['crop-lots', rowid],
        queryFn: () => getLotsByCrop(rowid!),
        enabled: !!rowid,
    });

    const listCrop = useQuery({
        queryKey: ['crop-list'],
        queryFn: getListCrop,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
    });

    const getVarieties = useQuery({
        queryKey: ['crop-varieties', code],
        queryFn: () => getVarietiesByCrop(code!),
        enabled: !!code,
    });

    return {
        createCrop,
        getCrop,
        deleteCrop,
        updateCrop,
        listCrop,
        getLotsByCropId,
        getVarieties
    }
};