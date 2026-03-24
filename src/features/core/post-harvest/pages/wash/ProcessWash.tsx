import { useForm } from "react-hook-form";
import { usePostHarvest, useGetProductsByCategory } from "../../../../../hooks";
import { WashProcessForm } from "../../../../../interfaces";
import {
  FormField,
  QualityOutputs,
  ActionButtons,
} from "../../../../../ui/components";
import { useEffect, useState } from "react";
import { Select } from "antd";
import { toast } from "react-toastify";

export const ProcessWash = () => {
  const { listWashQualities, listWashCosts, createWashProcess } = usePostHarvest();
  const { data: washQualities = [] } = listWashQualities;
  const { data: washCosts = [] } = listWashCosts;
  const {mutate: createWashProcessMutation} = createWashProcess;

  const { data: products = [] } = useGetProductsByCategory(true, "Papa");

  //!Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<WashProcessForm>();

  //!Pipeline
  // Filtrar productos padre (sin parent_key) que tienen hijos en el galpón principal — ordenados alfabéticamente
  const parentProducts = products
    ?.filter((product) => !product.parent_key)
    ?.sort((a, b) => (a.ref || "").localeCompare(b.ref || ""));

  // Id del producto padre seleccionado
  const [selectedParentId, setSelectedParentId] = useState<string>("");

  // Obtener productos hijo basados en el padre seleccionado — ordenados alfabéticamente
  const childProducts = (products
    ?.find((product) => product.id === selectedParentId)
    ?.variations || [])
    .sort((a, b) => (a.ref || "").localeCompare(b.ref || ""));
  
  // Estado para el stock máximo disponible
  const [maxStock, setMaxStock] = useState<number>(0);

  // Cuando cambia el padre, actualizar el estado y limpiar la selección del hijo
  const handleParentChange = (value: string | undefined) => {
    const parentId = value || "";
    setSelectedParentId(parentId);
    setValue("parent_potato_id", parentId);
    setValue("potato_id", ""); // Limpiar la selección del hijo
    setMaxStock(0); // Resetear el stock máximo
  };

  const inputBins = watch("number_of_bins") || 0;

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



  const onSubmit = handleSubmit((data) => {
    // Filter out quality outputs with 0 bags or missing quality_id
    const filteredData = {
      ...data,
      // Si no hay variante seleccionada, usar el producto padre como fuente
      potato_id: data.potato_id || data.parent_potato_id,
      quality_outputs: data.quality_outputs.filter(
        (output) => output.quality_id && output.bags > 0
      ),
    };

    // Don't submit if no quality outputs
    if (filteredData.quality_outputs.length === 0) {
      toast.error("Debe asignar bolsas a al menos una calidad");
      return;
    }

    createWashProcessMutation(filteredData, {
      onSuccess: () => {
        reset();
      },
    });
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proceso Lavadero</h1>

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
            <Select
              id="parent-potato-select"
              aria-label="Seleccionar producto principal"
              placeholder="Seleccione un producto principal"
              showSearch
              allowClear
              value={watch("parent_potato_id") || undefined}
              onChange={(value) => handleParentChange(value)}
              filterOption={(input, option) =>
                !!option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
              className="w-full"
            >
              {parentProducts?.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.ref}
                </Select.Option>
              ))}
            </Select>
          </FormField>

          <FormField
            label="Variante del Producto"
            error={errors.potato_id?.message || ""}
          >
            <Select
              id="potato-variant-select"
              aria-label="Seleccionar variante del producto"
              placeholder="Seleccione una variante"
              showSearch
              allowClear
              value={watch("potato_id") || undefined}
              onChange={(value) => setValue("potato_id", value || "")}
              disabled={!selectedParentId}
              filterOption={(input, option) =>
                !!option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
              className="w-full"
            >
              {childProducts?.map((product) => {
                // Encontrar el almacén con ID 7
                const warehouse7 = product.warehouses?.find((w) => w.id === 7);
                const stock = warehouse7?.stock || 0;

                return (
                  <Select.Option key={product.id} value={product.id}>
                    {product.ref}
                    {` (Stock: ${stock})`}
                  </Select.Option>
                );
              })}
            </Select>
          </FormField>

          <FormField
            label={maxStock > 0 ? `Número de bines que se procesan (máx: ${maxStock})` : `Número de bines que se procesan`}
            required
            error={errors.number_of_bins?.message || ""}
          >
            <input
              type="number"
              min="1"
              max={maxStock > 0 ? maxStock : undefined}
              {...register("number_of_bins", {
                required: "Este campo es requerido",
                min: {
                  value: 1,
                  message: "El número mínimo de bines es 1",
                },
                max: maxStock > 0 ? {
                  value: maxStock,
                  message: `El número máximo de bines es ${maxStock}`,
                } : undefined,
                valueAsNumber: true,
              })}
              placeholder="Número de bines"
              disabled={!selectedChildId}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 disabled:bg-gray-100"
            />
          </FormField>

          {/* Campo oculto para warehouse_id */}
          <input type="hidden" {...register("warehouse_id")} value={7} />

          <FormField label="Seleccionar Costo de Lavado" required>
            <select
              id="wash-cost-select"
              aria-label="Seleccionar costo de lavado"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              {...register("wash_cost_id", {
                required: "Este campo es requerido",
              })}
            >
              <option value="">Seleccione un costo de lavado</option>
              {washCosts?.map((cost) => (
                <option key={cost.rowid} value={cost.rowid}>
                  {`${new Date(cost.date).toLocaleDateString()} - ID: ${
                    cost.rowid
                  }`}
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

          <QualityOutputs
            qualities={washQualities || []}
            inputBins={inputBins}
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
          />

          <ActionButtons
            onCancel={() => {
              reset();
            }}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </div>
  );
};
