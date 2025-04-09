import {
  IrrigationCostForm,
  IrrigationFertirriegoSendData,
  IrrigationFormInterface,
  IrrigationHoursSendData,
} from "../../interfaces";
import { toast } from "react-toastify";
import {
  postCreateIrrigation,
  getIrrigationList,
  getIrrigationCosts,
  postIrrigationCosts,
  postIrrigationHours,
  postIrrigationFertirriego,
  getIrrigationInfo,
  deleteIrrigationHours,
  deleteIrrigationFertirriegoProduct,
} from "../../actions/index";
import { useBaseMutation, useBaseQuery } from "../index";

export const useIrrigation = (id?: string) => {
  const createIrrigation = useBaseMutation(
    (irrigation: IrrigationFormInterface) => postCreateIrrigation(irrigation),
    {
      onSuccess: () => {
        toast.success("Riego creado correctamente");
      },
    }
  );

  const irrigationList = useBaseQuery(["irrigationList"], getIrrigationList);

  const createIrrigationCosts = useBaseMutation(
    (irrigationCost: IrrigationCostForm) => postIrrigationCosts(irrigationCost),
    {
      onSuccess: () => {
        toast.success("Costo de riego creado correctamente");
      },
    }
  );

  const irrigationCosts = useBaseQuery(["irrigationCosts"], getIrrigationCosts);

  const createIrrigationHours = useBaseMutation(
    (irrigationHours: IrrigationHoursSendData) =>
      postIrrigationHours(irrigationHours),
    {
      onSuccess: () => {
        toast.success("Horas de riego creado correctamente");
      },
    }
  );

  const createIrrigationFertirriego = useBaseMutation(
    (irrigationFertirriego: IrrigationFertirriegoSendData) =>
      postIrrigationFertirriego(irrigationFertirriego),
    {
      onSuccess: () => {
        toast.success("Fertirriego creado correctamente");
      },
    }
  );

  const irrigationInfo = useBaseQuery(
    ["irrigationInfo"],
    () => getIrrigationInfo(id!),
    {
      enabled: !!id,
    }
  );

  const irrigationDeleteHours = useBaseMutation(
    (id: string) => deleteIrrigationHours(id),
    {
      onSuccess: () => {
        toast.success("Horas de riego eliminadas correctamente");
      },
    }
  );

  const irrigationDeleteFertirriegoProduct = useBaseMutation(
    (data: { productId: string; fertirriegoId: string }) =>
      deleteIrrigationFertirriegoProduct(data.productId, data.fertirriegoId),
    {
      onSuccess: () => {
        toast.success("Producto de fertirriego eliminado correctamente");
      },
    }
  );

  return {
    createIrrigation,
    irrigationList,
    irrigationCosts,
    createIrrigationCosts,
    createIrrigationHours,
    createIrrigationFertirriego,
    irrigationInfo,
    irrigationDeleteHours,
    irrigationDeleteFertirriegoProduct,
  };
};
