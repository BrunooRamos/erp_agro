import { useForm } from "react-hook-form";
import { FormField, ActionButtons } from "../../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { DepreciationCostForm } from "../../../../../interfaces";
import { useExpenses, useMachinery } from "../../../../../hooks";

export const DepreciationForm = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DepreciationCostForm>({
    defaultValues: {
      machinery_id: "",
      name: "",
      description: "",
    },
  });

  // Watch form values
  const machineryId = watch("machinery_id");
  const name = watch("name");
  const description = watch("description");

  // Custom validation function
  const validateAssetInfo = () => {
    if (machineryId) return true;
    if (name && description) return true;
    return "Debe seleccionar una maquinaria o ingresar nombre y descripción";
  };

  // Maquinaria
  const { listMachinery } = useMachinery(null);
  const { data: machinery = [], isLoading: isLoadingMachinery } = listMachinery;

  // Expenses
  const { createDepreciation } = useExpenses();
  const { mutate: createDepreciationMutation } = createDepreciation;

  // Submit
  const onSubmit = handleSubmit((data) => {
    if (!validateAssetInfo()) {
      return;
    }
    createDepreciationMutation(data, {
      onSuccess: () => {
        navigate("/cost-center/home");
      },
    });
  });

  if (isLoadingMachinery) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Depreciación </h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">
          Fórmula de Depreciación
        </h3>
        <div className="space-y-3 text-blue-700">
          <div className="flex items-center gap-2">
            <span className="font-mono bg-white px-3 py-1 rounded-md shadow-sm">
              Depreciación anual = (Costo - Valor residual) / Vida útil
            </span>
          </div>

          <div className="mt-4">
            <h4 className="font-medium text-blue-800 mb-2">Ejemplo:</h4>
            <div className="space-y-2">
              <p>
                Supongamos que se compra una máquina con las siguientes
                características:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Costo inicial:{" "}
                  <span className="font-semibold">USD 20,000</span>
                </li>
                <li>
                  Vida útil: <span className="font-semibold">5 años</span>
                </li>
                <li>
                  Valor residual:{" "}
                  <span className="font-semibold">USD 2,000</span>
                </li>
              </ul>
              <div className="mt-2">
                <p className="font-medium">Cálculo:</p>
                <p className="font-mono bg-white px-3 py-1 rounded-md shadow-sm inline-block">
                  (20,000 - 2,000) / 5 = USD 3,600 por año
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-6 p-6">
        <div className="space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Información general</h2>
            <p className="text-gray-600 mb-4">Si es una maquinaria se debe seleccionar una, en caso de que sea un edificio u otro activo fijo se debe ingresar el nombre del activo y la descripción</p>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="Maquinaria"
                error={errors.machinery_id?.message}
              >
                <select
                  {...register("machinery_id", {
                    validate: validateAssetInfo,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                  <option value="">Seleccione una maquinaria</option>
                  {machinery.map((machine) => (
                    <option key={machine.rowid} value={machine.rowid}>
                      {machine.name} - {machine.brand} {machine.model}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Nombre" error={errors.name?.message}>
                <input
                  {...register("name", {
                    validate: validateAssetInfo,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>

              <FormField label="Descripción" error={errors.description?.message}>
                <textarea
                  {...register("description", {
                    validate: validateAssetInfo,
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>
            </div>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la depreciación</h2>
            <div className="grid grid-cols-2 gap-6">
              <FormField
                label="Fecha inicio amortización"
                error={errors.date_start?.message}
                required
              >
                <input
                  type="date"
                  {...register("date_start", {
                    required: "Este campo es requerido",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>

              <FormField
                label="Vida útil (años)"
                error={errors.util_life?.message}
                required
              >
                <input
                  type="number"
                  {...register("util_life", {
                    required: "Este campo es requerido",
                    min: {
                      value: 0,
                      message: "El valor debe ser mayor a 0",
                    },
                    validate: (value) => {
                      return value > 0 || "El valor debe ser positivo";
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>

              <FormField
                label="Valor de compra"
                error={errors.purchase_value?.message}
                required
              >
                <input
                  type="number"
                  step="0.01"
                  {...register("purchase_value", {
                    required: "Este campo es requerido",
                    min: {
                      value: 0.01,
                      message: "El valor debe ser mayor a 0",
                    },
                    validate: (value) => {
                      return value > 0 || "El valor debe ser positivo";
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>

              <FormField
                label="Valor residual"
                error={errors.residual_value?.message}
                required
              >
                <input
                  type="number"
                  step="0.01"
                  {...register("residual_value", {
                    required: "Este campo es requerido",
                    min: {
                      value: 0.01,
                      message: "El valor debe ser mayor a 0",
                    },
                    validate: (value) => {
                      return value > 0 || "El valor debe ser positivo";
                    },
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>
            </div>
          </div>
        </div>

        <ActionButtons
          onCancel={() => navigate("/cost-center/depreciation")}
          onSubmit={onSubmit}
        />
      </form>
    </div>
  );
};
