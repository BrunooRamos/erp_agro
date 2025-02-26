import { useForm } from "react-hook-form";
import {
  IrrigationFormInterface,
  ProductsResponse,
  SelectedProducts,
} from "../../../../interfaces/index";
import {
  ActionButtons,
  CropInfoCard,
  EditProductModal,
  FormField,
  LotSelection,
  ProductCard,
  ProductFilterWithTree,
  SelectedProductsList,
  TotalAreaDisplay,
} from "../../../../ui/components";
import {
  useCropAndLots,
  useGetProductsByCategory,
  useListMachinery,
  useIrrigation,
} from "../../../../hooks";
import { useNavigate } from "react-router-dom";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

export const IrrigationForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    setValue,
  } = useForm<IrrigationFormInterface>();

  //!Crops and lots
  const {
    selectedLots,
    lots,
    sortedCrops,
    selectedCrop,
    isLoading: isLoadingCropAndLots,
    handleLotAreaChange,
    handleLotSelection,
    handleSublotSelection,
    selectedSublots,
    handleSublotAreaChange,
  } = useCropAndLots(control);

  //!Machinery
  const { data: machinery, isLoading: isLoadingMachinery } = useListMachinery();

  //!Irrigation materials
  const {
    data: materials,
    isLoading: isLoadingMaterials,
    categories: categoriesMaterials,
  } = useGetProductsByCategory(true, "Materiales");


  // Filtered materials
  const [filteredMaterials, setFilteredMaterials] = useState<
    ProductsResponse[]
  >([]);

  const handleProductsFiltered = useCallback(
    (filteredProducts: ProductsResponse[]) => {
      setFilteredMaterials(filteredProducts);
    },
    []
  );

  // Search query for materials
  const [searchQueryMaterials, setSearchQueryMaterials] = useState("");

  const [editingMaterial, setEditingMaterial] =
    useState<SelectedProducts | null>(null);

  const handleSelectMaterial = (material: ProductsResponse) => {
    setEditingMaterial({
      id: material.id,
      label: material.label,
      unit: material.array_options.options_medida || "u",
      presentation: +material.array_options.options_presentacion,
      type: material.array_options.options_tipo_presentacion,
      quantity: 0,
      warehouse_id: "",
    });
  };

  // Selected materials
  const [selectedMaterials, setSelectedMaterials] = useState<
    SelectedProducts[]
  >([]);

  // Remove seed from selected seeds
  const handleRemoveMaterial = (materialId: string) => {
    setSelectedMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  // Update quantity of selected seed
  const handleUpdateMaterialQuantity = (
    materialId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setSelectedMaterials((prev) =>
      prev.map((m) => (m.id === materialId ? { ...m, quantity } : m))
    );
  };

  const handleConfirmMaterial = (material: SelectedProducts) => {
    setSelectedMaterials((prev) => [...prev, material]);
    setEditingMaterial(null);
  };

  const handleMaterialModalQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (editingMaterial) {
      setEditingMaterial({
        ...editingMaterial,
        quantity: parseFloat(e.target.value) || 0,
      });
    }
  };

  const handleMaterialModalWarehouseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (editingMaterial) {
      setEditingMaterial({
        ...editingMaterial,
        warehouse_id: e.target.value,
      });
    }
  };

  //!Create irrigation
  const { createIrrigation, irrigationCosts } = useIrrigation();
  const { mutate: createIrrigationMutation } = createIrrigation;
  const { data: irrigationCostsData } = irrigationCosts;

  const onSubmit = handleSubmit((data) => {
    data.selectedLots = selectedLots;
    data.selectedMaterials = selectedMaterials;
    data.selectedSublots = selectedSublots;

    createIrrigationMutation(data, {
      onSuccess: () => {
        navigate("/irrigation");
        reset();
      },
      onError: () => {
        toast.error("Error al crear el riego");
      },
    });
  });

  const navigate = useNavigate();

  // Filter out already selected materials from the available products
  const availableMaterials = useMemo(() => {
    return (
      materials?.filter(
        (material) =>
          !selectedMaterials.some((selected) => selected.id === material.id)
      ) || []
    );
  }, [materials, selectedMaterials]);

  if (isLoadingCropAndLots || isLoadingMachinery || isLoadingMaterials) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Crear Riego</h1>

        <form onSubmit={onSubmit} className="w-full">
          <div className="w-full grid grid-cols-2 gap-4">
            {/* Date Field */}
            <FormField
              label="Fecha"
              error={errors.date?.message || ""}
              required
            >
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

            {/*Crop code*/}
            <FormField
              label="Código de cultivo"
              error={errors.crop_code?.message || ""}
              required
            >
              <select
                {...register("crop_code", {
                  required: "Este campo es requerido",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione un cultivo</option>
                {sortedCrops?.map(
                  (crop) =>
                    crop.cultivo === "Papa" && (
                      <option key={crop.code} value={crop.code}>
                        {crop.code}
                      </option>
                    )
                )}
              </select>
            </FormField>

            {/* Machinery */}
            <FormField
              label="Maquinaria"
              error={errors.first_equipment?.message || ""}
            >
              <select
                {...register("first_equipment")}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione una maquinaria</option>
                {machinery?.map((machinery) => (
                  <option key={machinery.rowid} value={machinery.rowid}>
                    {`${machinery.name} - ${machinery.brand} ${machinery.model}`}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Second equipment */}
            <FormField
              label="Maquinaria acoplada"
              error={errors.second_equipment?.message || ""}
            >
              <select
                {...register("second_equipment")}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione una maquinaria</option>
                {machinery?.map((machinery) => (
                  <option key={machinery.rowid} value={machinery.rowid}>
                    {`${machinery.name} - ${machinery.brand} ${machinery.model}`}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Meters of line mother */}
            <FormField
              label="Metros de linea madre"
              error={errors.meters_of_line_mother?.message || ""}
            >
              <input
                {...register("meters_of_line_mother", {
                  required: "Este campo es requerido",
                  onChange: (e) => {
                    const meters = parseFloat(e.target.value) || 0;
                    const baseCost = irrigationCostsData?.[0]?.cost_mother_line || 0;
                    const totalCost = (meters * baseCost) / 100;
                    // Update the cost_mother_line field
                    setValue("cost_mother_line", totalCost);
                  },
                })}
                type="number"
                placeholder="Ingrese los metros de linea madre"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
              {irrigationCostsData?.[0]?.cost_mother_line && (
                <span className="text-sm text-gray-500 mt-1 block">
                  Costo base: ${irrigationCostsData[0].cost_mother_line}/100m
                </span>
              )}
            </FormField>

            {/* Cost of line mother */}
            <FormField
              label="Costo de la linea madre"
              error={errors.cost_mother_line?.message || ""}
            >
              <input
                {...register("cost_mother_line", {
                  required: "Este campo es requerido",
                })}
                name="cost_mother_line"
                placeholder="Ingrese el costo de la linea madre"
                type="number"
                readOnly
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 bg-gray-50"
              />
            </FormField>

            {/* Crop type */}
            <CropInfoCard crop={selectedCrop} />

            {/* Add Lots Section after the existing fields */}
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lotes utilizados
              </label>
              <LotSelection
                lots={lots}
                
                onLotSelect={handleLotSelection}
                onAreaChange={handleLotAreaChange}
                selectedLots={selectedLots}

                //Sublot
                onSublotSelect={handleSublotSelection}
                selectedSublots={selectedSublots}
                onSublotAreaChange={handleSublotAreaChange}
                />
            </div>

            {/* Total applied area */}
            <TotalAreaDisplay selectedLots={selectedLots} selectedSublots={selectedSublots}/>

            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materiales <span className="text-red-500">*</span>
              </label>

              <ProductFilterWithTree
                products={availableMaterials}
                categories={categoriesMaterials!}
                onProductsFiltered={handleProductsFiltered}
                searchQuery={searchQueryMaterials}
                onSearchChange={(e) => setSearchQueryMaterials(e.target.value)}
              />

              <div className="grid grid-cols-1 gap-3 max-h-[32rem] overflow-y-auto px-1 mt-4">
                {filteredMaterials.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleSelectMaterial}
                  />
                ))}
              </div>

              <SelectedProductsList
                selectedProducts={selectedMaterials}
                onUpdateQuantity={handleUpdateMaterialQuantity}
                onRemoveProduct={handleRemoveMaterial}
              />

              {editingMaterial && (
                <EditProductModal
                  editingProduct={editingMaterial}
                  warehouses={
                    materials?.find((m) => m.id === editingMaterial?.id)
                      ?.warehouses || []
                  }
                  onClose={() => setEditingMaterial(null)}
                  onConfirm={handleConfirmMaterial}
                  onChangeQuantity={handleMaterialModalQuantityChange}
                  onChangeWarehouse={handleMaterialModalWarehouseChange}
                  title="Agregar insumo"
                  confirmButtonDisabled={
                    !editingMaterial?.warehouse_id || !editingMaterial?.quantity
                  }
                />
              )}
            </div>

            {/* Action Buttons */}
            <ActionButtons
              onCancel={() => navigate("/registers")}
              onSubmit={onSubmit}
            />
          </div>
        </form>
      </div>
    </>
  );
};
