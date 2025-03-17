import { useForm } from "react-hook-form";
import { ActionButtons, FormField } from "../../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { CostWashForm } from "../../../../../interfaces";
import { usePostHarvest } from "../../../../../hooks/";

export const CostWash = () => {
  const navigate = useNavigate();

  //!Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CostWashForm>();

  const { createWashCost, listWashCosts } = usePostHarvest();
  const { mutate: createWashCostMutation } = createWashCost;

  const { data: washCosts } = listWashCosts;

  const onSubmit = handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2));
    createWashCostMutation(data, {
      onSuccess: () => {
        listWashCosts.refetch();
      },
    });
  });

  // Calcular el costo total
  const calculateTotalCost = (cost: CostWashForm) => {
    return (
      cost.energy_cost +
      cost.maintenance_cost +
      cost.bag_cost +
      cost.film_cost +
      cost.thread_cost +
      cost.pallet_cost +
      cost.other_cost +
      cost.label_cost +
      cost.lift_cost
    ).toFixed(2);
  };

  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Costos de Lavado</h1>
      <p className="text-sm text-gray-500 mb-4">
        Los costos de lavado son aquellos que se incurren en el proceso de lavado de la papa. 
        Es IMPORTANTE tener en cuenta que se debe colocar el de cada elemento POR BOLSA.

        <span className="text-red-500 font-bold"> PONER TODOS LOS COSTOS EN PESOS.</span>
      </p>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1  gap-4">
          <div className="flex flex-col gap-2">
            <FormField
              label="Fecha"
              required
              error={errors.date?.message || ""}
            >
              <input
                type="date"
                {...register("date", {
                  required: "Este campo es requerido",
                })}
                id="wash-cost-date"
                aria-label="Fecha del costo de lavado"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo de Energía"
              required
              helpText="La fórmula es: (TOTAL recibo de luz * 0,70) / (TOTAL bolsas lavadas en el mes)"
              error={errors.energy_cost?.message || ""}
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("energy_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="energy-cost"
                aria-label="Costo de energía"
                placeholder="Costo de energía"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo de Mantenimiento"
              required
              error={errors.maintenance_cost?.message || ""}
              helpText="La fórmula es: (TOTAL costo de mantenimiento en un mes) / (TOTAL bolsas lavadas en el mes)"
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("maintenance_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="maintenance-cost"
                aria-label="Costo de mantenimiento"
                placeholder="Costo de mantenimiento"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo de Bolsas"
              required
              error={errors.bag_cost?.message || ""}
              helpText="La fórmula es: COSTO fardo de 1000 / 1000"
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("bag_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="bag-cost"
                aria-label="Costo de bolsas"
                placeholder="Costo de bolsas"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo de Film"
              required
              error={errors.film_cost?.message || ""}
              helpText="La fórmula es: (Costo del film / Cantidad de palets envueltos) / Cantidad de bolsas en un palet"
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("film_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="film-cost"
                aria-label="Costo de film"
                placeholder="Costo de film"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo de Hilo"
              required
              error={errors.thread_cost?.message || ""}
              helpText="La fórmula es: (Costo del hilo / Cantidad de bolsas cosidas con un rollo.)"
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("thread_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="thread-cost"
                aria-label="Costo de hilo"
                placeholder="Costo de hilo"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo de Pallets"
              required
              error={errors.pallet_cost?.message || ""}
              helpText="La fórmula es: (Costo de un pallet / (Cantidad de bolsas que se colocan en un pallet * Cantidad de veces que se usa un pallet))"
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("pallet_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="pallet-cost"
                aria-label="Costo de pallets"
                placeholder="Costo de pallets"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo de Etiqueta"
              required
              error={errors.label_cost?.message || ""}
              helpText="En este campo se debe colocar el costo UNITARIO de la etiqueta."
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("label_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="label-cost"
                aria-label="Costo de etiqueta"
                placeholder="Costo de etiqueta"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <FormField
              label="Costo del montacargas"
              required
              error={errors.lift_cost?.message || ""}
              helpText="La formula es: (Costo del montacargas por día) / (Cantidad de bolsas lavadas en el día)"
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("lift_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="lift-cost"
                aria-label="Costo del montacargas"
                placeholder="Costo del montacargas"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>
            
            

            <FormField
              label="Otros Costos"
              error={errors.other_cost?.message || ""}
              helpText="En este campo se puede colcar cualquier otro costo que se incurra en el proceso de lavado de la papa. Recordar que se debe colocar POR BOLSA."
            >
              <input
                type="number"
                step="0.01"
                min="0"
                {...register("other_cost", {
                  required: "Este campo es requerido",
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "El valor debe ser mayor o igual a 0",
                  },
                })}
                id="other-cost"
                aria-label="Otros costos"
                placeholder="Otros costos"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            <ActionButtons
              onCancel={() => {
                reset();
                navigate("/post-harvest/wash");
              }}
              onSubmit={onSubmit}
            />
          </div>
        </div>

        {/* Listar costos de lavado */}
        <div className="w-full mt-8">
          <h2 className="text-xl font-semibold mb-6 text-zinc-800">Historial de costos de Bolsa</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Energía</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mantenimiento</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bolsas</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Film</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hilo</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pallets</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etiqueta</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montacargas</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Otros</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {washCosts?.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(cost.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.energy_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.maintenance_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.bag_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.film_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.thread_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.pallet_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.label_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.lift_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.other_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${calculateTotalCost(cost)}</td>
                  </tr>
                ))}
                
                {(!washCosts || washCosts.length === 0) && (
                  <tr>
                    <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-500">
                      No hay costos de lavado registrados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div> 
      </form>
    </div>
  );
};
