import { useMutation } from "@tanstack/react-query";
import { deleteMachineryId } from "../../actions/machinery/delete-machinery-id";
import { toast } from "react-toastify";

export const useDeleteMachinery = () => {
    return useMutation({
        mutationFn: deleteMachineryId,
        onSuccess: () => {
            toast.success('Maquinaria eliminada correctamente');
        },
        onError: (error) => {
            toast.error('Error al eliminar la maquinaria' + error?.message);
        }
    });
};