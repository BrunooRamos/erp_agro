import { useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";

import { ActionButtons, FormField } from "../../../../ui/components";
import { useIrrigation } from "../../../../hooks";
import { IrrigationCostForm } from "../../../../interfaces";

export const IrrigationCosts = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<IrrigationCostForm>();

  const { createIrrigationCosts, irrigationCosts } = useIrrigation();
  const { data: irrigationCostsData } = irrigationCosts;
  
  const onSubmit = handleSubmit((data) => {

    console.log(JSON.stringify(data, null, 2));
    createIrrigationCosts.mutate(data, {
      onSuccess: () => {
        navigate("/irrigation");
        reset();
      },
    });
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Costos de riego pre-fijos</h1>
      <p className="text-sm text-gray-500 mb-4">
        Los costos pre-fijos son aquellos que están presentes durante todo el
        proceso de riego y están directamente relacionados.
      </p>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1  gap-4">
          <div className="flex flex-col gap-2">
            <FormField
              label="Costo de la linea madre"
              error=""
              helpText="Este costo se calcula como el valor de: 100 mts. de 6'' + 100 mts. de 4'' + 2 canillas a 4 años. Es importante tener en cuneta que represneta 'el frente' de una hectarea."
            >
              <input
                {...register("cost_mother_line")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese el costo de la linea madre"
              />
            </FormField>

            <FormField
              label="Cantidad de combustible por hora"
              error=""
              helpText="En este campo se debe colocar cuanto combustible consume la maquinaria por hora. El costo se calculará multiplicando este valor por el costo del combustible por litro el cual se mantiene actualizado en el sistema automaticamente."
            >
              <input
                {...register("fuel_consumption_per_hour")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese la cantidad de combustible por hora"
              />
            </FormField>

            <FormField
              label="Horas de mantenimiento"
              error=""
              helpText="En este campo se debe colocar el tiempo total que está trabajando la maquinaria en horas hasta que se le realiza el mantenimiento."
            >
              <input
                {...register("maintenance_hours")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese las horas de mantenimiento"
              />
            </FormField>

            <FormField
              label="Costo de mantenimiento"
              error=""
              helpText="En este campo se debe colocar el costo total del mantenimiento de la maquinaria. Filtro + aceite"
            >
              <input
                {...register("maintenance_cost")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese el costo de mantenimiento"
              />
            </FormField>
          </div>

          <ActionButtons
            onCancel={() => navigate("/irrigation")}
            onSubmit={onSubmit}
          />
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Registros anteriores</h2>
        {irrigationCostsData && irrigationCostsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Línea madre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Consumo combustible</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horas mantenimiento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo mantenimiento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...irrigationCostsData]
                  .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
                  .map((cost) => (
                    <tr key={cost.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(cost.date_creation).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${cost.cost_mother_line}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cost.fuel_consumption_per_hour} L/h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cost.maintenance_hours}h
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${cost.maintenance_cost}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay registros de costos disponibles</p>
        )}
      </div>
    </div>
  );
};
