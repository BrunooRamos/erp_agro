import { ActionButtons } from "../../../../../ui/components";
import { FormField } from "../../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { OtherExpensesCostForm } from "../../../../../interfaces";
import { useCrop, useExpenses } from "../../../../../hooks";

export const OtherExpensesForm = () => {
  const navigate = useNavigate();

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<OtherExpensesCostForm>();

  // Watch form values
  const amountPesos = watch("amount_pesos");
  const amountUsd = watch("amount_usd");

  // Custom validation function
  const validateAmount = () => {
    if (amountPesos && amountUsd) {
      return "Debe ingresar solo un monto, ya sea en pesos o en dólares";
    }
    if (!amountPesos && !amountUsd) {
      return "Debe ingresar un monto en pesos o en dólares";
    }
    return true;
  };

  // Crop
  const { listCrop } = useCrop();
  const { data: crops } = listCrop;

  const { createOtherExpenses } = useExpenses();
  const { mutate: createOtherExpensesMutation } = createOtherExpenses;

  // Submit
  const onSubmit = handleSubmit((data) => {
    if (!validateAmount()) {
      return;
    }
    createOtherExpensesMutation(data, {
      onSuccess: () => {
        navigate("/cost-center/other-expenses");
      },
    });
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Gasto</h1>

      <form onSubmit={onSubmit} className="space-y-6 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Otros gastos
        </h2>
        <p className="text-gray-600 mb-4">
          El monto se debe ingresar en PESOS o en DÓLARES. No se debe ingresar
          ambos montos. La conversión se hace de manera automática.
        </p>
        <div className="grid grid-cols-2 gap-6">
          <FormField label="Fecha" error={errors.date?.message} required>
            <input
              type="date"
              {...register("date", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField label="Nombre" error={errors.name?.message} required>
            <input
              {...register("name", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField label="Descripción" error={errors.description?.message}>
            <textarea
              {...register("description", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <FormField
            label="Monto en pesos"
            error={errors.amount_pesos?.message}
          >
            <input
              type="number"
              {...register("amount_pesos", {
                min: {
                  value: 0,
                  message: "El valor debe ser mayor a 0",
                },
                validate: (value) => {
                  if (value && amountUsd) {
                    return "Debe ingresar solo un monto, ya sea en pesos o en dólares";
                  }
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Monto en dólares"
            error={errors.amount_usd?.message}
          >
            <input
              type="number"
              {...register("amount_usd", {
                min: {
                  value: 0,
                  message: "El valor debe ser mayor a 0",
                },
                validate: (value) => {
                  if (value && amountPesos) {
                    return "Debe ingresar solo un monto, ya sea en pesos o en dólares";
                  }
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Código de cultivo"
            helpText="Opcionalmente se puede seleccionar un cultivo para asociar el gasto"
            error={errors.crop_code?.message}
          >
            <select
              {...register("crop_code")}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccione un cultivo</option>
              {crops?.map((crop) => (
                <option key={crop.rowid} value={crop.rowid}>
                  {crop.code}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <ActionButtons
          onCancel={() => navigate("/cost-center/depreciation")}
          onSubmit={onSubmit}
        />
      </form>
    </div>
  );
};
