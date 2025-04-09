import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getByIdField,
  postCreateField,
  putUpdateField,
  getListField,
  deleteField as deleteFieldAction,
  getMapField,
  getLotByField as getLotByFieldAction,
} from "../../actions/index";
import { FieldForm } from "../../interfaces";
import { useBaseMutation, useBaseQuery } from "../index";

export const useField = (code?: string, field?: string) => {
  const queryClient = useQueryClient();

  const createField = useBaseMutation(
    (field: FieldForm) => postCreateField(field),
    {
      onSuccess: () => {
        toast.success("Campo creado correctamente");
      },
    }
  );

  const updateField = useBaseMutation(
    ({ code, data }: { code: string; data: FieldForm }) =>
      putUpdateField(code, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["field-list"] });
        toast.success("Campo actualizado exitosamente");
      },
    }
  );

  const getField = useBaseQuery(
    ["field", code ?? ""],
    () => getByIdField(code!),
    {
      enabled: !!code,
    }
  );

  const getFields = useBaseQuery(["field-list"], getListField);

  const deleteField = useBaseMutation(
    (code: string) => deleteFieldAction(code),
    {
      onSuccess: () => {
        toast.success("Campo eliminado correctamente");
      },
    }
  );

  const getMapFields = useBaseQuery(["field-map"], getMapField);

  const getLotByField = useBaseQuery(
    ["field-lot", field ?? ""],
    () => getLotByFieldAction(field!),
    {
      enabled: !!field,
    }
  );

  return {
    createField,
    updateField,
    getField,
    getFields,
    deleteField,
    getMapFields,
    getLotByField,
  };
};
