import { useMutation } from '@tanstack/react-query';
import { postCreateMachinery } from '../../actions';
import { MachineryForm } from '../../interfaces';

export const useCreateMachinery = () => {
  return useMutation({
    mutationFn: (machinery: MachineryForm) => postCreateMachinery(machinery),
    onError: (error) => {
      console.error('Error creating machinery:', error);
    }
  });
}; 