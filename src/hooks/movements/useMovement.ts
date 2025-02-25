import { useMutation } from "@tanstack/react-query";
import { MovementForm } from "../../interfaces";
import { toast } from "react-toastify";
import { postCreateMovement } from "../../actions/index";


export const useMovement = () => {
    const createMovement = useMutation({
        mutationFn: (data: MovementForm) => postCreateMovement(data),
        onSuccess: () => {
            toast.success('Movimiento creado correctamente');
        },
        onError: (error) => {
            toast.error('Error al crear el movimiento: ' + error);
        }
    });

    return { createMovement };
};



