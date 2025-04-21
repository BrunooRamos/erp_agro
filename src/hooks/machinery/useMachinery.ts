import { useQueryClient } from "@tanstack/react-query";

import {
  getByIdMachinery,
  getListMachinery,
  putUpdateMachinery,
  deactivateMachineryId,
  postCreateMachinery,
  postCreateMaintenance,
} from "../../actions";
import { MachineryForm, MaintenanceFormData } from "../../interfaces";

import { toast } from "react-toastify";
import { useBaseQuery, useBaseMutation } from "../index";
export const useMachinery = (code: string | null | undefined) => {
  const queryClient = useQueryClient();

  const listMachinery = useBaseQuery(["machinery-list"], getListMachinery, {
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const machineryById = useBaseQuery(
    ["machinery", code ?? ""],
    () => getByIdMachinery(code!),
    {
      enabled: !!code,
    }
  );

  const updateMachinery = useBaseMutation(
    ({ code, data }: { code: string; data: MachineryForm }) =>
      putUpdateMachinery(code, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["machinery-list"] }); // Invalidate and refetch the machinery list
        toast.success("Maquinaria actualizada exitosamente");
      },
    }
  );

  const deactivateMachinery = useBaseMutation(deactivateMachineryId, {
    onSuccess: () => {
      toast.success("Maquinaria desactivada correctamente");
    },
  });

  const createMachinery = useBaseMutation(
    (machinery: MachineryForm) => postCreateMachinery(machinery),
    {
      onSuccess: () => {
        toast.success("Maquinaria creada correctamente");
      },
    }
  );


  const createMaintenance = useBaseMutation(
    (maintenance: MaintenanceFormData) => postCreateMaintenance(maintenance),
    {
      onSuccess: () => {
        toast.success("Mantenimiento creado correctamente");
      },
    }
  );
  return {
    listMachinery,
    machineryById,
    updateMachinery,
    deactivateMachinery,
    createMachinery,
    createMaintenance,
  };
};
