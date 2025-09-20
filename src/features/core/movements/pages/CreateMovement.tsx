import { useForm } from "react-hook-form";

import { FormField } from "../../../../ui/components/common/FormField";
import { MovementForm } from "../../../../interfaces";
import { useCrop } from "../../../../hooks/crop/useCrop";
import { useERPInfo } from "../../../../hooks";
import { ActionButtons } from "../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMovement } from "../../../../hooks/movements/useMovement";

export const CreateMovement = () => {
  const navigate = useNavigate();

  //!Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<MovementForm>();

  const { createMovement } = useMovement();
  const { mutate: createMovementMutation } = createMovement;

  const onSubmit = handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2));
    createMovementMutation(data, {
      onSuccess: () => {
        navigate("/movements");
      },
    });
  });

  //!Crops
  const selectedCrop = watch("crop");
  const selectedLot = watch("lot");

  const { listCrop, getCrop, getVarieties, getSublots } = useCrop( selectedCrop, selectedLot );

  const { data: crops } = listCrop;
  const availableCrops = crops?.filter((crop) => crop.cultivo === "Papa");

  const { data: crop, isLoading: isLoadingCrop } = getCrop;
  const lots = crop?.lots;

  const { data: sublots, isLoading: isLoadingSublots } = getSublots;

  const { data: varieties, isLoading: isLoadingVarieties } = getVarieties;

  useEffect(() => {
    if (selectedCrop) {
      getCrop.refetch();
      getVarieties.refetch();
    }
  }, [selectedCrop]);

  //!Warehouses
  const { warehouses } = useERPInfo();

  //!Logistic Costs
  const { listLogisticCosts } = useMovement();
  const { data: logisticCosts, isLoading: isLoadingLogisticCosts } = listLogisticCosts;

  if (isLoadingCrop || isLoadingVarieties || isLoadingLogisticCosts || isLoadingSublots)  {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Stock</h1>

      <p className="text-sm text-gray-500 mb-4">
        Este formulario se utiliza para CREAR un nuevo stock de papa que sale de
        un cultivo y va a un almacén (galpón o cámara). Para crear un nuevo
        movimiento de stock existente, se puede hacer desde Dolibarr.
      </p>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <FormField
            label="Origen - Cultivo"
            error={errors.crop?.message || ""}
            required
          >
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              {...register("crop", {
                required: "Este campo es requerido",
              })}
            >
              <option value="">Seleccione un cultivo</option>
              {Array.isArray(availableCrops) && availableCrops?.map((crop) => (
                <option key={crop.code} value={crop.rowid}>
                  {crop.code}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Destino - Almacen"
            error={errors.warehouse_id?.message || ""}
            required
          >
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              {...register("warehouse_id", {
                required: "Este campo es requerido",
              })}
            >
              <option value="">Seleccione un almacén</option>
              {Array.isArray(warehouses) && warehouses?.map((category) => (
                <optgroup key={category.name} label={category.name}>
                  {Array.isArray(category.warehouses) && category.warehouses.map((warehouse) => (
                    <option
                      key={`${category.name}-${warehouse.id}`}
                      value={warehouse.id}
                    >
                      {warehouse.ref}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </FormField>

          <FormField label="Costo logístico" error={errors.logistic_cost?.message || ""} required>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              {...register("logistic_cost", {
                required: "Este campo es requerido",
              })}
            >
              <option value="">Seleccione un costo logístico</option>
              {Array.isArray(logisticCosts) && logisticCosts?.map((cost) => (
                <option key={cost.id} value={cost.cost}>
                    {cost.origin} {'->'} {cost.destination} | ${cost.cost}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Fecha" error={errors.date?.message || ""} required>
            <input
              {...register("date", {
                required: "Este campo es requerido",
              })}
              name="date"
              placeholder="DD/MM/YYYY"
              type="date"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField label="Lote" error={errors.lot?.message || ""} required>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              {...register("lot", {
                required: "Este campo es requerido",
              })}
              disabled={!selectedCrop || isLoadingCrop}
            >
              <option value="">Seleccione un lote</option>
              {Array.isArray(lots) && lots?.map((lot) => (
                <option key={lot.id_lote} value={lot.id_lote}>
                  {lot.name}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Sublote" error={errors.lot?.message || ""}>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              {...register("sublot")}
              disabled={!selectedCrop || isLoadingCrop || isLoadingSublots}
            >
              <option value="">Seleccione un sublote</option>
              {Array.isArray(sublots) && sublots?.map((sublot) => (
                <option key={sublot.id} value={sublot.id}>
                  {sublot.name}
                </option>
              ))}
            </select>
          </FormField>



          <FormField
            label="Variedad"
            error={errors.variety?.message || ""}
            required
          >
            {Array.isArray(varieties) && varieties.length > 0 ? (
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                {...register("variety", {
                  required: "Este campo es requerido",
                })}
                disabled={!selectedCrop || isLoadingVarieties}
              >
                <option value="">Seleccione una variedad</option>
                {varieties.map((variety) => (
                  <option key={variety.rowid} value={variety.name}>
                    {variety.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register("variety", {
                  required: "Este campo es requerido",
                })}
                name="variety"
                placeholder="Ingrese la variedad"
                type="text"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                disabled={!selectedCrop || isLoadingVarieties}
              />
            )}
          </FormField>

          <FormField
            label="Variedad - Código"
            error={errors.variety_code?.message || ""}
            required
          >
            <input
              {...register("variety_code", {
                required: "Este campo es requerido",
                setValueAs: (value) => value.toUpperCase(),
              })}
              name="variety_code"
              placeholder="Código de la variedad"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              style={{ textTransform: 'uppercase' }}
              onChange={(e) => {
                e.target.value = e.target.value.toUpperCase();
              }}
            />
          </FormField>

          <FormField
            label="Tipo"
            error={errors.type?.message || ""}
            required
          >
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              {...register("type", {
                required: "Este campo es requerido",
              })}
            >
              <option value="">Seleccione un tipo</option>
              <option value="semilla">Semilla</option>
              <option value="consumo">Consumo</option>
            </select>
          </FormField>

          <FormField
            label="Cantidad de bins"
            error={errors.quantity?.message || ""}
            required
          >
            <input
              {...register("quantity", {
                required: "Este campo es requerido",
              })}
              name="quantity"
              placeholder="Cantidad"
              inputMode="numeric"
              type="number"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <ActionButtons
            onCancel={() => navigate("/movements")}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </div>
  );
};
