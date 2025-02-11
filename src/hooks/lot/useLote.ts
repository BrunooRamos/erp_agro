import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { postCreateLot, putUpdateLot, getListLot, getByIdLot, deleteLot as deleteLotAction, getMapLot as getMapLotAction } from '../../actions/lot/lot_actions';

import { LotForm } from '../../interfaces';


export const useLot = (code?: string) => {
  const queryClient = useQueryClient();

  const createLot = useMutation({
    mutationFn: (field: LotForm) => postCreateLot(field),
    onSuccess: () => {
      toast.success('Lote creado correctamente');
    },
    onError: (error) => {
      toast.error('Error al crear el lote: ' + error);
    }
  });

const updateLot = useMutation({
    mutationFn: ({ code, data }: { code: string; data: LotForm }) => 
      putUpdateLot(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lot-list'] });
      toast.success('Lote actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el lote: ' + error?.message);
      console.error('Error updating field lot:', error);
    }
  });

  const getLot = useQuery({
    queryKey: ['lot', code],
    queryFn: () => getByIdLot(code!),
    enabled: !!code,
  });

  const getLots = useQuery({
    queryKey: ['lot-list'],
    queryFn: () => getListLot(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const deleteLot = useMutation({
    mutationFn: (code: string) => deleteLotAction(code),
    onSuccess: () => {
      toast.success('Lote eliminado correctamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el campo: ' + error);
    }
  });

  const getMapLot = useQuery({
    queryKey: ['lot-map'],
    queryFn: () => getMapLotAction(),
  });


  return {
    createLot,
    updateLot,
    getLot,
    getLots,
    deleteLot,
    getMapLot
  };
};


