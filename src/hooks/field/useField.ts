import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getByIdField, postCreateField, putUpdateField, getListField, deleteField as deleteFieldAction, getMapField, getLotByField as getLotByFieldAction } from '../../actions/index';
import { FieldForm } from '../../interfaces';

export const useField = (code?: string, field?: string) => {
  const queryClient = useQueryClient();

  const createField = useMutation({
    mutationFn: (field: FieldForm) => postCreateField(field),
    onSuccess: () => {
      toast.success('Campo creado correctamente');
    },
    onError: (error) => {
      toast.error('Error al crear el lote de campo: ' + error);
    }
  });

const updateField = useMutation({
    mutationFn: ({ code, data }: { code: string; data: FieldForm }) => 
      putUpdateField(code, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['field-list'] });
      toast.success('Campo actualizado exitosamente');
    },
    onError: (error) => {
      toast.error('Error al actualizar el lote de campo: ' + error?.message);
      console.error('Error updating field lot:', error);
    }
  });

  const getField = useQuery({
    queryKey: ['field', code],
    queryFn: () => getByIdField(code!),
    enabled: !!code,
  });

  const getFields = useQuery({
    queryKey: ['field-list'],
    queryFn: () => getListField(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  const deleteField = useMutation({
    mutationFn: (code: string) => deleteFieldAction(code),
    onSuccess: () => {
      toast.success('Campo eliminado correctamente');
    },
    onError: (error) => {
      toast.error('Error al eliminar el campo: ' + error);
    }
  });

  const getMapFields = useQuery({
    queryKey: ['field-map'],
    queryFn: () => getMapField(),
  });

  const getLotByField = useQuery({
    queryKey: ['field-lot', field],
    queryFn: () => getLotByFieldAction(field!),
    enabled: false,
  });

  return {
    createField,
    updateField,
    getField,
    getFields,
    deleteField,
    getMapFields,
    getLotByField
  };
};


