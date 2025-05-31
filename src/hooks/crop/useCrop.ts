import { useQueryClient } from "@tanstack/react-query";

import { toast } from "react-toastify";
import { CropForm } from "../../interfaces";
import {
  getByIdCrop,
  postCreateCrop,
  deleteCrop as deleteCropAction,
  putUpdateCrop,
  getListCrop,
  getLotsByCrop,
  getVarietiesByCrop,
  getSublotsByLot,
} from "../../actions";
import { useBaseMutation, useBaseQuery } from "../index";

export const useCrop = ( crop_id?: string, lot?: string) => {
  const queryClient = useQueryClient();

  const createCrop = useBaseMutation((crop: CropForm) => postCreateCrop(crop), {
    onSuccess: () => {
      toast.success("Cultivo creado correctamente");
    },
  });

  const getCrop = useBaseQuery(["crop", crop_id ?? ""], () => getByIdCrop(crop_id!), {
    enabled: !!crop_id, // Only run query if code exists
  });

  const deleteCrop = useBaseMutation(deleteCropAction, {
    onSuccess: () => {
      toast.success("Cultivo eliminado correctamente");
    },
  });

  const updateCrop = useBaseMutation(
    ({ code, data }: { code: string; data: CropForm }) =>
      putUpdateCrop(code, data),
    {
      onSuccess: () => {
        // Invalidate and refetch the machinery list
        queryClient.invalidateQueries({ queryKey: ["field-lot-list"] });
        toast.success("Cultivo actualizado exitosamente");
      },
    }
  );

  const getLotsByCropId = useBaseQuery(
    ["crop-lots", crop_id ?? ""],
    () => getLotsByCrop(crop_id!),
    {
      enabled: !!crop_id,
    }
  );

  const listCrop = useBaseQuery(["crop-list"], getListCrop);

  const getVarieties = useBaseQuery(
    ["crop-varieties", crop_id ?? ""],
    () => getVarietiesByCrop(crop_id!),
    {
      enabled: !!crop_id,
    }
  );

  const getSublots = useBaseQuery(
    ["crop-sublots", lot ?? ""],
    () => getSublotsByLot(crop_id!, lot!),
    {
      enabled: !!lot && !!crop_id,
    }
  );

  return {
    createCrop,
    getCrop,
    deleteCrop,
    updateCrop,
    listCrop,
    getLotsByCropId,
    getVarieties,
    getSublots,
  };
};
