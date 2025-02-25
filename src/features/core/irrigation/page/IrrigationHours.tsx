import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { FormField } from "../../../../ui/components/common/FormField";
import { IrrigationHoursSendData } from "../../../../interfaces/";

export const IrrigationHours = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const irrigationData = location.state?.irrigationData;

  console.log(irrigationData);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IrrigationHoursSendData>({
    defaultValues: {
      date: irrigationData?.irrigation.date.split('T')[0],
    }
  });

  // Redirect if no irrigation data is present
  if (!irrigationData) {
    navigate('/irrigation/list');
    return null;
  }

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Horas de Riego - {irrigationData.irrigation.crop_code}</h1>

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
        
          
        </div>
      </form>
    </>
  );
};
