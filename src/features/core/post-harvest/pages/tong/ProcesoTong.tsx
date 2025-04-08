import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  ActionButtons,
  FormField,
  CaliberOutputs,
} from "../../../../../ui/components";
import { TongProccesForm } from "../../../../../interfaces";
import { useGetProductsByCategory, usePostHarvest } from "../../../../../hooks";

export const TongProcces = () => {
  const navigate = useNavigate();

  const { listCalibers, listTongCosts, createTongProcess } = usePostHarvest();
  const { data: products = [] } = useGetProductsByCategory(true, "Papa");

  //!Calibres
  const { data: calibers = [] } = listCalibers;

  // Estado para el producto padre seleccionado
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  // Estado para el stock máximo disponible
  const [maxStock, setMaxStock] = useState<number>(0);

  // Filtrar productos padre (sin parent_key) que tienen hijos en el warehouse 7
  const parentProducts = products?.filter((product) => !product.parent_key);

  // Obtener productos hijo basados en el padre seleccionado y que estén en warehouse 7
  const childProducts = products
    ?.find((product) => product.id === selectedParentId)
    ?.variations?.filter((variation) => 
      variation.warehouses?.some((w) => w.id === 7)
    ) || [];

  //!Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<TongProccesForm>({
    defaultValues: {
      caliber_outputs: calibers.map((caliber) => ({
        caliber_id: caliber.id,
        bins: 0,
      })),
      warehouse_id: 7, // Establecer el valor predeterminado para warehouse_id
    },
  });

  // Observar el producto hijo seleccionado para actualizar el stock máximo
  const selectedChildId = watch("potato_id");

  // Actualizar el stock máximo cuando cambia el producto hijo seleccionado
  useEffect(() => {
    if (selectedChildId) {
      const selectedChild = childProducts?.find((p) => p.id === selectedChildId);
      const warehouse7 = selectedChild?.warehouses?.find((w) => w.id === 7);
      const availableStock = warehouse7?.stock || 0;
      setMaxStock(availableStock);

      // Si el número de bines actual es mayor que el stock disponible, ajustarlo
      const currentBins = watch("number_of_bins");
      if (currentBins > availableStock) {
        setValue("number_of_bins", availableStock);
      }
    } else {
      setMaxStock(0);
    }
  }, [selectedChildId, products, setValue, watch]);

  // Cuando cambia el padre, actualizar el estado y limpiar la selección del hijo
  const handleParentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const parentId = e.target.value;
    setSelectedParentId(parentId);
    setValue("potato_id", ""); // Limpiar la selección del hijo
    setMaxStock(0); // Resetear el stock máximo
  };

  const inputBins = watch("number_of_bins") || 0;
  const caliberOutputs = watch("caliber_outputs") || [];
  const totalOutputBins = caliberOutputs.reduce(
    (sum, item) => sum + (Number(item.bins) || 0),
    0
  );

  //!Costos y calculos
  const { data: tongCosts = [] } = listTongCosts;
  const selectedTongCost = watch("tong_cost_id");

  // Calcular costo proporcional basado en los bines utilizados
  const calculateProportionalCost = () => {
    if (!selectedTongCost || !inputBins) return null;

    const selectedCost = tongCosts.find((cost) => cost.id.toString() === selectedTongCost);
    if (!selectedCost) return null;

    const proportion = inputBins / selectedCost.max_bins;

    return {
      fuelCost: (selectedCost.fuel_cost * proportion).toFixed(2),
      gataCost: (selectedCost.gata_cost * proportion).toFixed(2),
      liftCost: (selectedCost.lift_cost * proportion).toFixed(2),
      fuelLiters: (selectedCost.fuel_liters * proportion).toFixed(2),
    };
  };

  const proportionalCost = calculateProportionalCost();

  const { mutate: createTongProcessMutate } = createTongProcess;

  const onSubmit = handleSubmit((data) => {
    if (data.number_of_bins !== totalOutputBins) {
      return; // No permitir enviar si los bins no coinciden
    }

    // Asegurarse de que los costos calculados y el warehouse_id estén incluidos en el envío
    const dataToSubmit = {
      ...data,
      // Asegurarse de que warehouse_id esté incluido
      warehouse_id: data.warehouse_id || 7,
    };
    
    console.log(JSON.stringify(dataToSubmit, null, 2));
    createTongProcessMutate(dataToSubmit);
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proceso Tong</h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <FormField label="Fecha" required error={errors.date?.message || ""}>
            <input
              type="date"
              {...register("date", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Producto Principal"
            required
            error={errors.parent_potato_id?.message || ""}
          >
            <select
              id="parent-potato-select"
              aria-label="Seleccionar producto principal"
              {...register("parent_potato_id", {
                required: "Este campo es requerido",
                onChange: handleParentChange,
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccione un producto principal</option>
              {parentProducts?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.ref}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Variante del Producto"
            required
            error={errors.potato_id?.message || ""}
          >
            <select
              id="potato-variant-select"
              aria-label="Seleccionar variante del producto"
              {...register("potato_id", {
                required: "Este campo es requerido",
              })}
              disabled={!selectedParentId}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 disabled:bg-gray-100"
            >
              <option value="">Seleccione una variante</option>
              {childProducts?.map((product) => {
                // Encontrar el almacén con ID 7
                const warehouse7 = product.warehouses?.find((w) => w.id === 7);
                const stock = warehouse7?.stock || 0;

                return (
                  <option key={product.id} value={product.id}>
                    {product.ref}
                    {` (Stock: ${stock})`}
                  </option>
                );
              })}
            </select>
          </FormField>

          <FormField
            label={`Número de bines que se procesan (máx: ${maxStock})`}
            required
            error={errors.number_of_bins?.message || ""}
          >
            <input
              type="number"
              min="1"
              max={maxStock}
              {...register("number_of_bins", {
                required: "Este campo es requerido",
                min: {
                  value: 1,
                  message: "El número mínimo de bines es 1",
                },
                max: {
                  value: maxStock,
                  message: `El número máximo de bines es ${maxStock}`,
                },
                valueAsNumber: true,
              })}
              placeholder="Número de bines"
              disabled={!selectedChildId || maxStock === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 disabled:bg-gray-100"
            />
          </FormField>

          {/* Campo oculto para warehouse_id */}
          <input type="hidden" {...register("warehouse_id")} value={7} />

          <FormField label="Seleccionar Costo de Tong" required>
            <select
              id="tong-cost-select"
              aria-label="Seleccionar costo de tong"
              {...register("tong_cost_id", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              value={selectedTongCost || ""}
            >
              <option value="">Seleccione un costo de tong</option>
              {tongCosts?.map((cost) => (
                <option key={cost.id} value={cost.id}>
                  {`${new Date(cost.date).toLocaleDateString()} - Max Bins: ${
                    cost.max_bins
                  } - Combustible: $${cost.fuel_cost}`}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Otros costos (en USD)" 
            error={errors.other_cost?.message || ""}
          >
            <input
              type="number"
              {...register("other_cost")}
              placeholder="Otros costos"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          {selectedTongCost && inputBins > 0 && (
            <div className="col-span-2 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h3 className="font-semibold mb-2">
                Costos Proporcionales ({inputBins} bins de{" "}
                {tongCosts.find((c) => c.id.toString() === selectedTongCost)?.max_bins ||
                  0}
                )
              </h3>
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <p className="text-sm text-gray-600">Combustible</p>
                  <p className="font-medium">${proportionalCost?.fuelCost}</p>
                  <input
                    type="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Litros de Combustible</p>
                  <p className="font-medium">
                    {proportionalCost?.fuelLiters} L
                  </p>
                  <input
                    type="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Gata</p>
                  <p className="font-medium">
                    USD {proportionalCost?.gataCost}
                  </p>
                  <input
                    type="hidden"
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Elevador</p>
                  <p className="font-medium">
                    USD {proportionalCost?.liftCost}
                  </p>
                  <input
                    type="hidden"
                  />
                </div>
              </div>
            </div>
          )}

          <CaliberOutputs
            calibers={calibers}
            inputBins={inputBins}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <ActionButtons
            onCancel={() => {
              reset();
              navigate("/post-harvest");
            }}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </div>
  );
};
