import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ActionButtons, FormField, DeleteConfirmModal } from "../../../../../ui/components";
import { CreateTongCostForm } from "../../../../../interfaces";
import { usePostHarvest } from "../../../../../hooks";
import { useState } from "react";
import { toast } from "react-toastify";

export const CostoTong = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, } = useForm<CreateTongCostForm>();
 
  const { createTongCost, listTongCosts, deleteTongCost } = usePostHarvest();
  
  const { mutate: createTongCostMutate } = createTongCost;
  
  const onSubmit = handleSubmit((data) => {
    createTongCostMutate(data, {
      onSuccess: () => {
        listTongCosts.refetch();
      }
    });
  });

  const { mutate: deleteTongCostMutate } = deleteTongCost;

  const handleDeleteTongCost = (id: number) => {
    deleteTongCostMutate(id.toString(), {
      onSuccess: () => {
        listTongCosts.refetch();
      }
    });
  }

  const { data: tongCostsData } = listTongCosts;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingCostId, setDeletingCostId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (costId: number) => {
    setDeletingCostId(costId);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCostId) return;

    try {
      setIsDeleting(true);
      await handleDeleteTongCost(deletingCostId);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    } catch (error : unknown) {
      toast.error('Error al eliminar el costo: ' + error);
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Costos de proceso Tong pre-fijos</h1>
      <p className="text-sm text-gray-500 mb-4">
          Los costos pre-fijos son aquellos que están presentes durante el
          proceso de clasificación con la Tong.

          Es IMPORTANTE tener en cuenta que se debe poner la cantidad de bines que se procesan en el día como máximo y sus costos. 
      </p>

      <p className="text-sm font-bold text-red-600 mb-4">LOS COSTOS DEBEN AGREGARSE EN DÓLARES</p>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1  gap-4">
          <div className="flex flex-col gap-2">

            <FormField
              label="Fecha"
              error=""
              helpText="Fecha de la clasificación"
              required
            >
              <input {...register("date")} type="date" className="w-full p-2 border border-gray-300 rounded-md" />
            </FormField>

            <FormField
              label="Cantidad de bines"
              error=""
              helpText="En este campo se debe colocar la cantidad de bines que se procesan en el día como máximo."
              required
            >
              <input {...register("max_bins")} type="number" className="w-full p-2 border border-gray-300 rounded-md" />
            </FormField>

            <FormField
              label="Cantidad de combustible por día"
              error=""
              helpText="En este campo se debe colocar cuanto combustible consume la maquinaria por hora. El costo se calculará multiplicando este valor por el costo del combustible por litro el cual se mantiene actualizado en el sistema automaticamente."
              required
            >
              <input
                {...register("fuel_liters")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese la cantidad de combustible por día"
              />
            </FormField>

            <FormField
              label="Costo de la gata"
              error=""
              helpText="En este campo se debe colocar el costo de la gata por día."
              required
            >
              <input
                {...register("gata_cost")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese las horas de mantenimiento"
              />
            </FormField>

            <FormField
              label="Costo del montacargas"
              error=""
              helpText="En este campo se debe colocar el costo del montacargas por día."
              required
            >
              <input
                {...register("lift_cost")}
                type="number"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Ingrese el costo de mantenimiento"
              />
            </FormField>
          </div>

          <ActionButtons
            onCancel={() => navigate("/post-harvest/tong")}
            onSubmit={onSubmit}
          />
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Registros anteriores</h2>
        {tongCostsData && tongCostsData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de bines</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad de combustible</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo de combustible</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo gata</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo montacargas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[...tongCostsData]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((cost) => (
                    <tr key={cost.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(cost.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cost.max_bins}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cost.fuel_liters} L/día
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cost.fuel_cost} $
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cost.gata_cost} USD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {cost.lift_cost} USD
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleDeleteClick(cost.id)}
                          className="px-3 py-1 text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Eliminar
                        </button>
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

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingCostId(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
