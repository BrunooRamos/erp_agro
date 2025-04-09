import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  postCreateLot,
  putUpdateLot,
  getListLot,
  getByIdLot,
  deleteLot as deleteLotAction,
  getMapLot as getMapLotAction,
} from "../../actions/lot/lot_actions";

import { LotForm } from "../../interfaces";
import { useBaseMutation, useBaseQuery } from "../index";

export const useLot = (code?: string) => {
  const queryClient = useQueryClient();

  const createLot = useBaseMutation((field: LotForm) => postCreateLot(field), 
    {
      onSuccess: () => {
        toast.success("Lote creado correctamente");
      },
    }
  );

  const updateLot = useBaseMutation(
    ({ code, data }: { code: string; data: LotForm }) =>
      putUpdateLot(code, data),
    {
      onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lot-list"] });
      toast.success("Lote actualizado exitosamente");
    },
  });

  const getLot = useBaseQuery(
    ["lot", code ?? ""],
    () => getByIdLot(code!),
    {
      enabled: !!code,
    }
  );

  const getLots = useBaseQuery(
    ["lot-list"],
    getListLot,
  );

  const deleteLot = useBaseMutation((code: string) => deleteLotAction(code),
    {
      onSuccess: () => {
        toast.success("Lote eliminado correctamente");
      },
    }
  );

  const getMapLot = useBaseQuery(
    ["lot-map"],
    getMapLotAction,
  );

  return {
    createLot,
    updateLot,
    getLot,
    getLots,
    deleteLot,
    getMapLot,
  };
};
