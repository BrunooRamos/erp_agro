import { useMutation } from '@tanstack/react-query';
import { postCreateMachinery } from '../../actions';
import { MachineryForm } from '../../interfaces';
import { toast } from 'react-toastify';

export const useCreateMachinery = () => {
  return useMutation({
    mutationFn: (machinery: MachineryForm) => postCreateMachinery(machinery),
    onSuccess: () => {
      toast.success('Maquinaria creada correctamente');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });
}; 