import { useMutation, useQueryClient } from '@tanstack/react-query';
import { putUpdateMachinery } from '../../actions';
import { MachineryForm } from '../../interfaces';
import { toast } from 'react-toastify';

export const useUpdateMachinery = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ code, data }: { code: string; data: MachineryForm }) => 
            putUpdateMachinery(code, data),
        onSuccess: () => {
            // Invalidate and refetch the machinery list
            queryClient.invalidateQueries({ queryKey: ['machinery-list'] });
            toast.success('Maquinaria actualizada exitosamente');
        },
        onError: (error) => {
            toast.error('Error al actualizar la maquinaria: ' + error?.message);
            console.error('Error updating machinery:', error);
        }
    });
};