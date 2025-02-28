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

  const { createIrrigationHours } = useIrrigation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<IrrigationHoursSendData>({
    defaultValues: {
      date: irrigationData?.irrigation.date.split("T")[0],
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
  } = useCropAndLots(control, irrigationData.irrigation.crop_code);

  // Redirect if no irrigation data is present
  if (!irrigationData) {
    navigate("/irrigation/list");
    return null;
  }

  const onSubmit = handleSubmit((data) => {
    data.crop_code = irrigationData.irrigation.crop_code;
    data.lots_irrigated = selectedLots;
    data.sublots_irrigated = selectedSublots;

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
        Horas de Riego - {irrigationData.irrigation.crop_code}
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
