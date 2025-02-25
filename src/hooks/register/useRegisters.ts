import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { GeneralLabor, RAFSendData, SeedMapRegisterInterface } from "../../interfaces";
import { getListLabor, getListRAF, getListSeedMap, getRAFByCropId, postCreateGeneralLabor, postCreateRAF, postCreateSeedMap } from "../../actions";

export const useRegisters = ( cropId?: string ) => {
    const createRAF = useMutation({
        mutationFn: (field: RAFSendData) => postCreateRAF(field),
        onSuccess: () => {
            toast.success('RAF creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el RAF: ' + error);
        }
    });


    const createSeedMap = useMutation({
        mutationFn: (field: SeedMapRegisterInterface) => postCreateSeedMap(field),
        onSuccess: () => {
            toast.success('Seed Map creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el Seed Map: ' + error);
        }
    });

    const createGeneralLabor = useMutation({
        mutationFn: (field: GeneralLabor) => postCreateGeneralLabor(field),
        onSuccess: () => {
            toast.success('General Labor creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el General Labor: ' + error);
        }
    });

    const listRAF = useQuery({
        queryKey: ['list-raf'],
        queryFn: () => getListRAF(),
    });

    const rafByCropId = useQuery({
        queryKey: ['raf-by-crop-id', cropId],
        queryFn: () => getRAFByCropId(cropId!),
        enabled: !!cropId,
    });

    const listSeedMap = useQuery({
        queryKey: ['list-seed-map'],
        queryFn: () => getListSeedMap(),
    });


    const listLabor = useQuery({
        queryKey: ['list-labor'],
        queryFn: () => getListLabor(),
    });


    return { createRAF, createSeedMap, createGeneralLabor, rafByCropId, listRAF, listSeedMap, listLabor };
};
