import { useState, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import { RAF_OPTIONS } from "../../constants/raf";
import {
  ProductsResponse,
  RAFSendData,
  SelectedProducts,
} from "../../../../../interfaces";
import {
  useRegisters,
  useCropAndLots,
  useGetProductsByCategory,
  useCusa,
  useMachinery,
} from "../../../../../hooks";
import {
  FormField,
  CropInfoCard,
  LotSelection,
  TotalAreaDisplay,
  ProductCard,
  EditProductModal,
  ActionButtons,
  ProductFilterWithTree,
} from "../../../../../ui/components";
import { SelectedProductsList } from "../../../../../ui/components/common/SelectedProductsList";

export const CreateRAF = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<RAFSendData>();

  //!Get crops and lots
  const {
    selectedLots,
    selectedSublots,
    //crops,
    lots,
    sortedCrops,
    selectedCrop,
    isLoading: isLoadingCropAndLots,
    handleLotAreaChange,
    handleLotSelection,

    handleSublotSelection,
    handleSublotAreaChange,
  } = useCropAndLots(control);

  //!Machinery
  const { listMachinery } = useMachinery(null);
  const { data: machinery, isLoading: isLoadingMachinery } = listMachinery;

  //!Fetch category by label
  // Watch type and sub_type
  const selectedType = useWatch({
    control,
    name: "type",
  });

  const selectedSubType = useWatch({
    control,
    name: "sub_type",
  });

  const shouldFetchChemicals =
    (selectedType === "mantenimiento_cultivo" &&
      selectedSubType === "apl_agroquimico") ||
    (selectedType === "barbecho" && selectedSubType === "quimico");

  // Get category by label
  const {
    data: products,
    isLoading: isLoadingProducts,
    categories: categoriesProducts,
  } = useGetProductsByCategory(shouldFetchChemicals, "Insumos");

  const [filteredProducts, setFilteredProducts] = useState<ProductsResponse[]>(
    []
  );

  //!Fetch cusa
  // Cusa
  const { data: cusa, isLoading: isLoadingCusa } = useCusa();

  //!Submit form - Create and update RAF
  const { createRAF } = useRegisters();
  const { mutate: createRAFMutation } = createRAF;

  const navigate = useNavigate(); // Hook para navegar a la lista de RAF

  const onSubmit = handleSubmit((data) => {
    // Check if chemicals are required and if they're selected
    const chemicalsRequired = shouldFetchChemicals;
    const hasChemicals = selectedProducts.length > 0;

    if (chemicalsRequired && !hasChemicals) {
      toast.error("Debe seleccionar al menos un producto");
      return;
    }

    data.selectedLots = selectedLots;
    data.selectedProducts = selectedProducts;
    data.selectedSublots = selectedSublots;
    console.log(JSON.stringify(data, null, 2));

    createRAFMutation(data, {
      onSuccess: () => {
        navigate("/registers");
        reset();
      },
    });
  });

  // Dentro del componente RAF, agrega este nuevo estado después de los otros estados
  const [searchQuery, setSearchQuery] = useState("");

  // Add new state for selected products
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>(
    []
  );

  // Add state for product being edited
  const [editingProduct, setEditingProduct] = useState<SelectedProducts | null>(
    null
  );

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  // Update handler functions for products
  const handleSelectProduct = (product: ProductsResponse) => {
    setEditingProduct({
      id: product.id,
      label: product.label,
      unit: product.array_options.options_medida || "u",
      presentation: +product.array_options.options_presentacion,
      type: product.array_options.options_tipo_presentacion,
      quantity: 0,
      warehouse_id: "",
    });
  };

  const handleConfirmProduct = () => {
    if (!editingProduct) return;

    if (!editingProduct.warehouse_id) {
      toast.error("Debe seleccionar un depósito");
      return;
    }

    if (editingProduct.quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === editingProduct.id);
      if (exists) {
        return prev.map((p) =>
          p.id === editingProduct.id ? { ...editingProduct } : p
        );
      }
      return [...prev, editingProduct];
    });
    setEditingProduct(null);
  };

  const handleModalQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      quantity: parseFloat(e.target.value) || 0,
    });
  };

  const handleModalWarehouseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      warehouse_id: e.target.value,
    });
  };

  // Add useMemo for available products
  const availableProducts = useMemo(() => {
    return (
      products?.filter(
        (product) =>
          !selectedProducts.some((selected) => selected.id === product.id)
      ) || []
    );
  }, [products, selectedProducts]);

  // Loading crops
  if (
    isLoadingProducts ||
    isLoadingCropAndLots ||
    isLoadingCusa ||
    isLoadingMachinery
  ) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Crear Registro de Aplicación Fitosanitaria (R.A.F){" "}
      </h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4">
          {/* Basic Information Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-zinc-800">
              Información Básica
            </h2>
          </div>

          {/* Date Field */}
          <FormField label="Fecha" error={errors.date?.message || ""}>
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
            error={errors.crop_id?.message || ""}
          >
            <select
              {...register("crop_id", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccione un cultivo</option>
              {sortedCrops?.map((crop) => (
                <option key={crop.rowid} value={crop.rowid}>
                  {crop.code}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Cusa"
            error={errors.cusa_id?.message || ""}
            required
          >
            <select
              {...register("cusa_id", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccione una cusa</option>
              {cusa?.map((labor) => (
                <option key={labor.rowid} value={labor.rowid}>
                  {labor.laboreo}
                </option>
              ))}
            </select>
          </FormField>

          {/* Machinery */}
          <FormField
            label="Maquinaria"
            error={errors.first_equipment?.message || ""}
            required
          >
            <select
              {...register("first_equipment", {
                required: "Este campo es requerido",
              })}
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
          <TotalAreaDisplay
            selectedLots={selectedLots}
            selectedSublots={selectedSublots}
          />

          {/* Type Field */}
          <FormField
            label="Tipo de Aplicación"
            error={(errors.type && errors.type.message) || ""}
          >
            <select
              {...register("type", { required: "Este campo es requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccione un tipo</option>
              {RAF_OPTIONS.types.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </FormField>

          {selectedType &&
            RAF_OPTIONS.subTypes[
              selectedType as keyof typeof RAF_OPTIONS.subTypes
            ] && (
              <FormField
                label="Subtipo de aplicación"
                error={(errors.sub_type && errors.sub_type.message) || ""}
              >
                <select
                  {...register("sub_type", {
                    required: "Este campo es requerido",
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                  <option value="">Seleccione un método</option>
                  {RAF_OPTIONS.subTypes[
                    selectedType as keyof typeof RAF_OPTIONS.subTypes
                  ]?.map((subType) => (
                    <option key={subType.value} value={subType.value}>
                      {subType.label}
                    </option>
                  ))}
                </select>
              </FormField>
            )}

          {/* Sub Type Field - Solo se muestra si hay un tipo seleccionado */}
          {shouldFetchChemicals && (
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Productos aplicados <span className="text-red-500">*</span>
              </label>

              <ProductFilterWithTree
                products={availableProducts}
                categories={categoriesProducts!}
                onProductsFiltered={(filteredProducts: ProductsResponse[]) => {
                  setFilteredProducts(filteredProducts);
                }}
                searchQuery={searchQuery}
                onSearchChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
              />

              <SelectedProductsList
                selectedProducts={selectedProducts}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveProduct={handleRemoveProduct}
              />
              {editingProduct && (
                <EditProductModal
                  editingProduct={editingProduct}
                  warehouses={
                    products
                      ?.find((p) => p.id === editingProduct.id)
                      ?.warehouses.map((w) => ({
                        ...w,
                        id: w.id,
                      })) || []
                  }
                  onClose={() => setEditingProduct(null)}
                  onConfirm={handleConfirmProduct}
                  onChangeQuantity={handleModalQuantityChange}
                  onChangeWarehouse={handleModalWarehouseChange}
                />
              )}
              <div className="grid grid-cols-1 gap-3 max-h-[32rem] overflow-y-auto px-1 py-3">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onSelectProduct={handleSelectProduct}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Buttons Section */}
        <ActionButtons
          onCancel={() => navigate("/registers")}
          onSubmit={onSubmit}
        />
      </form>
    </div>
  );
};
