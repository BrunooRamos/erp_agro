
import { toast } from "react-toastify";
import { GeneralLabor, RAFSendData, SeedMapRegisterInterface } from "../../interfaces";
import { getListLabor, getListRAF, getListSeedMap, getRAFByCropId, postCreateGeneralLabor, postCreateRAF, postCreateSeedMap } from "../../actions";
import { useBaseMutation, useBaseQuery } from "../index";

export const useRegisters = ( cropId?: string ) => {
    const createRAF = useBaseMutation(
        (field: RAFSendData) => postCreateRAF(field),
        {
            onSuccess: () => {
                toast.success('RAF creado correctamente');
            },
        }
    );


    const createSeedMap = useBaseMutation(
        (field: SeedMapRegisterInterface) => postCreateSeedMap(field),
        {
            onSuccess: () => {
                toast.success('Seed Map creado correctamente');
            },
        }
    );

    const createGeneralLabor = useBaseMutation(
        (field: GeneralLabor) => postCreateGeneralLabor(field),
        {
            onSuccess: () => {
                toast.success('General Labor creado correctamente');
            },
        }
    );

    const listRAF = useBaseQuery(
        ['list-raf'],
        getListRAF,
    );

    const rafByCropId = useBaseQuery(
        ['raf-by-crop-id', cropId ?? ''],
        () => cropId ? getRAFByCropId(cropId) : Promise.reject('No crop ID'),
        {
            enabled: !!cropId,
        }
    );

    const listSeedMap = useBaseQuery(
        ['list-seed-map'],
        getListSeedMap,
    );


    const listLabor = useBaseQuery(
        ['list-labor'],
        getListLabor,
    );


    return { createRAF, createSeedMap, createGeneralLabor, rafByCropId, listRAF, listSeedMap, listLabor };
};
