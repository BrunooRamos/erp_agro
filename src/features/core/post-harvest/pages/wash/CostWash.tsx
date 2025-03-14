import { useForm } from "react-hook-form";
import { ActionButtons, FormField } from "../../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { CostWashForm } from "../../../../../interfaces";

export const CostWash = () => {
  const navigate = useNavigate();

  //!Form 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CostWashForm>();

  const onSubmit = handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2)); 
    // createWashCostMutation(data, {
    //   onSuccess: () => {
    //     listWashCosts.refetch();
    //   },
    // });
  });

  // // Calcular el costo total
  // const calculateTotalCost = (cost: any) => {
  //   return (
  //     parseFloat(cost.energy_cost || 0) +
  //     parseFloat(cost.maintenance_cost || 0) +
  //     parseFloat(cost.bag_cost || 0) +
  //     parseFloat(cost.film_cost || 0) +
  //     parseFloat(cost.thread_cost || 0) +
  //     parseFloat(cost.pallet_cost || 0) +
  //     parseFloat(cost.other_cost || 0)
  //   ).toFixed(2);
  // };

  // // Formatear fecha
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString();
  // };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Costos de Lavado</h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <FormField label="Fecha" required error={errors.date?.message || ""}>
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
            label="Otros Costos" 
            required 
            error={errors.other_cost?.message || ""}
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

        {/* Listar costos de lavado
        <div className="w-full mt-8">
          <h2 className="text-xl font-semibold mb-6 text-zinc-800">Historial de Costos de Lavado</h2>
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
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Otros</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {washCosts.map((cost) => (
                  <tr key={cost.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(cost.date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.energy_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.maintenance_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.bag_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.film_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.thread_cost}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cost.pallet_cost}</td>
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
        </div> */}
      </form>
    </div>
  );
};
