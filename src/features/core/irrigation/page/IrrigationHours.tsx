import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FormField,
  ActionButtons,
  TotalAreaDisplay,
  LotSelection,
  CropInfoCard,
} from "../../../../ui/components";
import { IrrigationHoursSendData } from "../../../../interfaces/";
import { useCropAndLots, useIrrigation } from "../../../../hooks/";

export const IrrigationHours = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const irrigationData = location.state?.irrigationData;

  const { createIrrigationHours, irrigationCosts } = useIrrigation();
  const { data: irrigationCostsData } = irrigationCosts;

  console.log(JSON.stringify(irrigationData, null, 2));

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IrrigationHoursSendData>({
    defaultValues: {
      date: irrigationData?.date.split("T")[0],
    },
  });

  const {
    selectedLots,
    selectedSublots,
    selectedCrop,
    lots,
    isLoading: isLoadingCropAndLots,
    handleLotAreaChange,
    handleLotSelection,
    handleSublotSelection,
    handleSublotAreaChange,
    getMaxAreaForLot,
    getMaxAreaForSublot
  } = useCropAndLots(control, irrigationData.crop_id.toString(), irrigationData);

  // Redirect if no irrigation data is present
  if (!irrigationData) {
    navigate("/irrigation/list");
    return null;
  }

  const onSubmit = handleSubmit((data) => {
    data.lots_irrigated = selectedLots;
    data.sublots_irrigated = selectedSublots;
    data.irrigation_id = irrigationData.rowid;
    console.log(JSON.stringify(data, null, 2));

    createIrrigationHours.mutate(data, {
      onSuccess: () => {
        navigate("/irrigation/list");
      },
    });
  });

  // Loading crops
  if (isLoadingCropAndLots) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">
        Horas de Riego - {irrigationData.crop_code}
      </h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4">
          {/* Date Field */}
          <FormField label="Fecha" error={errors.date?.message || ""}>
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

          <FormField
              label="Costo"
              error={errors.cost_id?.message || ""}
            >
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                {...register("cost_id", {
                  required: "Este campo es requerido",
                })}
              >
                <option value="">Seleccione un costo</option>
                {irrigationCostsData?.map((cost) => (
                  <option key={cost.id} value={cost.id}>
                    Consumo de combustible: ${cost.fuel_consumption_per_hour} y mantenimiento: ${cost.maintenance_cost}
                  </option>
                ))}
              </select>
            </FormField>

          {/* Hours Field */}
          <FormField label="Horas" error={errors.hours?.message || ""}>
            <input
              {...register("hours", {
                required: "Este campo es requerido",
              })}
              name="hours"
              placeholder="Horas"
              type="number"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          {/* Crop type */}
          <CropInfoCard crop={selectedCrop} />

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
              getMaxAreaForLot={getMaxAreaForLot}
              getMaxAreaForSublot={getMaxAreaForSublot}
            />
          </div>

          {/* Total applied area */}
          <TotalAreaDisplay
            selectedLots={selectedLots}
            selectedSublots={selectedSublots}
          />

          {/* Actions */}
          <ActionButtons
            onCancel={() => navigate("/irrigation/list")}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </>
  );
};
