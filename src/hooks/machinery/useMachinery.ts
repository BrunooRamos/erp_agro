import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getByIdMachinery,
  getListMachinery,
  putUpdateMachinery,
  deactivateMachineryId,
  postCreateMachinery,
} from "../../actions";
import { MachineryForm } from "../../interfaces";

import { toast } from "react-toastify";

export const useMachinery = (code: string | null | undefined) => {
  const queryClient = useQueryClient();

  const listMachinery = useQuery({
    queryKey: ["machinery-list"],
    queryFn: getListMachinery,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const machineryById = useQuery({
    queryKey: ["machinery", code],
    queryFn: () => getByIdMachinery(code!),
    enabled: !!code, // Only run query if code exists
  });

  const updateMachinery = useMutation({
    mutationFn: ({ code, data }: { code: string; data: MachineryForm }) =>
      putUpdateMachinery(code, data),
    onSuccess: () => {
      // Invalidate and refetch the machinery list
      queryClient.invalidateQueries({ queryKey: ["machinery-list"] });
      toast.success("Maquinaria actualizada exitosamente");
    },
    onError: (error) => {
      toast.error("Error al actualizar la maquinaria: " + error?.message);
    },
  });


  const deactivateMachinery = useMutation({
    mutationFn: deactivateMachineryId,
    onSuccess: () => {
      toast.success("Maquinaria desactivada correctamente");
    },
    onError: (error) => {
      toast.error("Error al desactivar la maquinaria" + error?.message);
    },
  });

  const createMachinery = useMutation({
    mutationFn: (machinery: MachineryForm) => postCreateMachinery(machinery),
    onSuccess: () => {
      toast.success('Maquinaria creada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  return { listMachinery, machineryById, updateMachinery, deactivateMachinery, createMachinery };
};
