import { UseFormRegister } from "react-hook-form";
import { WashProcessForm } from "../../../interfaces";
interface WashCostsProps {
  selectedWashCost: number;
  totalBags: number;
  washCost: {
    energyCost?: string;
    maintenanceCost?: string;
    bagCost?: string;
    filmCost?: string;
    threadCost?: string;
    palletCost?: string;
    labelCost?: string;
    liftCost?: string;
    otherCost?: string;
    totalCost?: string;
  } | null;
  register: UseFormRegister<WashProcessForm>;
}

export const WashCosts = ({ selectedWashCost, totalBags, washCost, register }: WashCostsProps) => {
  if (!selectedWashCost || !totalBags || !washCost) return null;

  return (
    <div className="col-span-2 p-4 bg-gray-50 rounded-md border border-gray-200">
      <h3 className="font-semibold mb-2">
        Costos del Proceso (Total bolsas: {totalBags})
      </h3>
      <div className="grid grid-cols-4 gap-3">
        <div>
          <p className="text-sm text-gray-600">Energía</p>
          <p className="font-medium">${washCost.energyCost}</p>
          <input
            type="hidden"
            {...register("energy_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Mantenimiento</p>
          <p className="font-medium">${washCost.maintenanceCost}</p>
          <input
            type="hidden"
            {...register("maintenance_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Bolsas</p>
          <p className="font-medium">${washCost.bagCost}</p>
          <input
            type="hidden"
            {...register("bag_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Film</p>
          <p className="font-medium">${washCost.filmCost}</p>
          <input
            type="hidden"
            {...register("film_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Hilo</p>
          <p className="font-medium">${washCost.threadCost}</p>
          <input
            type="hidden"
            {...register("thread_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Pallet</p>
          <p className="font-medium">${washCost.palletCost}</p>
          <input
            type="hidden"
            {...register("pallet_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Etiqueta</p>
          <p className="font-medium">${washCost.labelCost}</p>
          <input
            type="hidden"
            {...register("label_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Elevador</p>
          <p className="font-medium">${washCost.liftCost}</p>
          <input
            type="hidden"
            {...register("lift_cost", { valueAsNumber: true })}
          />
        </div>
        <div>
          <p className="text-sm text-gray-600">Otros</p>
          <p className="font-medium">${washCost.otherCost}</p>
          <input
            type="hidden"
            {...register("other_cost", { valueAsNumber: true })}
          />  
        </div>
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="font-medium">${washCost.totalCost}</p>
          <input
            type="hidden"
          />  
        </div>
      </div>
    </div>
  );
}; 