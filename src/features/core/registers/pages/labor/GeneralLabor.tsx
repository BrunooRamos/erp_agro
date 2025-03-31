/*
  A este componente se le pasa un objeto de tipo GeneralLaborInterface
  y se renderiza un formulario con los campos que tiene ese objeto.


  TODO: 
    Hacer las peticiones y validaciones de los campos. 
    Hacer la lógica del lado del servidor para guardar el registro.
*/

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { GeneralLabor as GeneralLaborInterface } from "../../../../../interfaces";
import {
  ActionButtons,
  CropInfoCard,
  FormField,
  LotSelection,
  TotalAreaDisplay,
} from "../../../../../ui/components";
import {
  useCropAndLots,
  useCusa,
  useMachinery,
  useRegisters,
} from "../../../../../hooks";
import { useNavigate } from "react-router-dom";

export const GeneralLabor = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<GeneralLaborInterface>();

  // Crops and lots
  const {
    selectedLots,
    selectedSublots,

    lots,
    sortedCrops,
    selectedCrop,
    isLoading: isLoadingCropAndLots,
    handleLotAreaChange,
    handleLotSelection,

    handleSublotSelection,
    handleSublotAreaChange,
  } = useCropAndLots(control);

  // Machinery
  const { listMachinery } = useMachinery(null)
  const { data: machinery, isLoading: isLoadingMachinery } = listMachinery;

  // Cusa
  const { data: cusa, isLoading: isLoadingCusa } = useCusa();
  const selectedLabor = watch("labor_code");

  // Actualiza el costo cusa según el labor seleccionado
  useEffect(() => {
    if (selectedLabor && cusa) {
      const selectedCusaItem = cusa.find(
        (item) => item.cod_laboreo === selectedLabor
      );
      if (selectedCusaItem) {
        setValue("cusa_cost", selectedCusaItem.precio_cusa);
        setValue("lts", selectedCusaItem.lts_ha);
      }
    }
  }, [selectedLabor, cusa, setValue]);

  const { createGeneralLabor } = useRegisters();
  const { mutate: createGeneralLaborMutation } = createGeneralLabor;

  const onSubmit = handleSubmit((data) => {
    data.selectedLots = selectedLots;
    data.selectedSublots = selectedSublots;
    console.log(JSON.stringify(data, null, 2));

    createGeneralLaborMutation(data, {
      onSuccess: () => {
        navigate("/registers");
        reset();
      },
    });
  });

  const navigate = useNavigate();

  if (isLoadingCropAndLots || isLoadingMachinery || isLoadingCusa) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Crear Registro de Labores</h1>

        <form onSubmit={onSubmit} className="w-full">
          <div className="w-full grid grid-cols-2 gap-4">
            {/* Basic Information Section */}
            <div className="col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-zinc-800">
                Información Básica
              </h2>
            </div>

            {/* Date Field */}
            <FormField
              label="Fecha"
              error={errors.date?.message || ""}
              required
            >
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

            {/*Crop code*/}
            <FormField
              label="Código de cultivo"
              error={errors.crop_code?.message || ""}
              required
            >
              <select
                {...register("crop_code", {
                  required: "Este campo es requerido",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione un cultivo</option>
                {sortedCrops?.map((crop) => (
                  <option key={crop.code} value={crop.code}>
                    {crop.code}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Machinery */}
            <FormField
              label="Maquinaria"
              error={errors.first_equipment?.message || ""}
              required
            >
              <select
                {...register("first_equipment", {
                  required: "Este campo es requerido",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione una maquinaria</option>
                {machinery?.map((machinery) => (
                  <option key={machinery.rowid} value={machinery.rowid}>
                    {`${machinery.name} - ${machinery.brand} ${machinery.model}`}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Second equipment */}
            <FormField
              label="Maquinaria acoplada"
              error={errors.second_equipment?.message || ""}
            >
              <select
                {...register("second_equipment")}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione una maquinaria</option>
                {machinery?.map((machinery) => (
                  <option key={machinery.rowid} value={machinery.rowid}>
                    {`${machinery.name} - ${machinery.brand} ${machinery.model}`}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Cusa information */}
            <FormField
              label="Cusa"
              error={errors.labor_code?.message || ""}
              required
            >
              <select
                {...register("labor_code", {
                  required: "Este campo es requerido",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione una cusa</option>
                {cusa?.map((labor) => (
                  <option key={labor.cod_laboreo} value={labor.cod_laboreo}>
                    {labor.laboreo}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Cusa Cost */}
            <FormField
              label="Costo de cusa"
              error={errors.cusa_cost?.message || ""}
            >
              <input
                {...register("cusa_cost", {
                  min: {
                    value: 0,
                    message: "El costo debe ser mayor a 0",
                  },
                })}
                name="cusa_cost"
                placeholder="100"
                type="number"
                step="0.01"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            {/* Lts Field */}
            <FormField label="Lts/ha" error={errors.lts?.message || ""}>
              <input
                {...register("lts", {
                  min: {
                    value: 0,
                    message: "El costo debe ser mayor a 0",
                  },
                })}
                name="lts"
                placeholder="100"
                type="number"
                step="0.01"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            {/* Crop type */}
            <CropInfoCard crop={selectedCrop} />

            {/* Add Lots Section after the existing fields */}
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lotes utilizados
              </label>
              <LotSelection
                lots={lots}
                onLotSelect={handleLotSelection}
                onAreaChange={handleLotAreaChange}
                selectedLots={selectedLots}
                //Sublot
                onSublotSelect={handleSublotSelection}
                selectedSublots={selectedSublots}
                onSublotAreaChange={handleSublotAreaChange}
              />
            </div>

            {/* Total applied area */}
            <TotalAreaDisplay selectedLots={selectedLots} selectedSublots={selectedSublots} />

            {/* Action Buttons */}
            <ActionButtons
              onCancel={() => navigate("/registers")}
              onSubmit={onSubmit}
            />
          </div>
        </form>
      </div>
    </>
  );
};
