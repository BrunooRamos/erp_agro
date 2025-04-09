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
} from "../../actions";
import { useBaseMutation, useBaseQuery } from "../index";

export const useCrop = (code?: string, rowid?: string) => {
  const queryClient = useQueryClient();

  const createCrop = useBaseMutation((crop: CropForm) => postCreateCrop(crop), {
    onSuccess: () => {
      toast.success("Lote de campo creado correctamente");
    },
  });

  const getCrop = useBaseQuery(["crop", code ?? ""], () => getByIdCrop(code!), {
    enabled: !!code, // Only run query if code exists
  });

  const deleteCrop = useBaseMutation(deleteCropAction, {
    onSuccess: () => {
      toast.success("Lote de campo eliminado correctamente");
    },
  });

  const updateCrop = useBaseMutation(
    ({ code, data }: { code: string; data: CropForm }) =>
      putUpdateCrop(code, data),
    {
      onSuccess: () => {
        // Invalidate and refetch the machinery list
        queryClient.invalidateQueries({ queryKey: ["field-lot-list"] });
        toast.success("Lote de campo actualizado exitosamente");
      },
    }
  );

  const getLotsByCropId = useBaseQuery(
    ["crop-lots", rowid ?? ""],
    () => getLotsByCrop(rowid!),
    {
      enabled: !!rowid,
    }
  );

  const listCrop = useBaseQuery(["crop-list"], getListCrop);

  const getVarieties = useBaseQuery(
    ["crop-varieties", code ?? ""],
    () => getVarietiesByCrop(code!),
    {
      enabled: !!code,
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
  };
};
