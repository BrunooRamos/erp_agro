/**
 * @component CreateRAF
 * 
 * @description
 * Componente para la creación de Registros de Aplicación Fitosanitaria (RAF).
 * Permite registrar aplicaciones de productos fitosanitarios, incluyendo detalles
 * sobre cultivos, lotes, maquinaria y productos utilizados.
 * 
 * @features
 * - Formulario completo para registro de RAF con:
 *   - Información básica (fecha, cultivo, CUSA)
 *   - Selección de maquinaria principal y acoplada
 *   - Gestión de lotes y sublotes con áreas
 *   - Selección de tipo y subtipo de aplicación
 *   - Sistema de filtrado y selección de productos fitosanitarios
 *   - Gestión de cantidades y depósitos por producto
 * 
 * @validations
 * - Campos requeridos para información crítica
 * - Validación de productos químicos cuando son necesarios
 * - Control de cantidades positivas en productos
 * - Verificación de selección de depósito
 * 
 * @hooks
 * - useForm: Gestión del formulario y validaciones
 * - useCropAndLots: Manejo de cultivos y lotes
 * - useMachinery: Obtención de maquinaria disponible
 * - useGetProductsByCategory: Filtrado de productos por categoría
 * - useCusa: Obtención de información CUSA
 * - useRegisters: Mutación para crear registros
 * 
 * @states
 * - selectedProducts: Productos seleccionados con cantidades y depósitos
 * - editingProduct: Producto en edición actual
 * - filteredProducts: Lista de productos filtrados
 * - searchQuery: Término de búsqueda para productos
 * 
 * @performance
 * - Uso de useMemo para optimizar filtrado de productos
 * - Carga condicional de productos químicos
 * - Manejo eficiente de estados de carga
 * 
 * @error-handling
 * - Manejo de errores en carga de datos
 * - Validación de formularios con mensajes de error
 * - Notificaciones toast para errores de usuario
 * 
 * @dependencies
 * - react-hook-form: Manejo de formularios
 * - react-toastify: Notificaciones
 * - react-router-dom: Navegación
 * 
 * @notes
 * - El componente requiere acceso a la API para productos y depósitos
 * - Se debe mantener consistencia en las unidades de medida
 * - Las validaciones dependen del tipo de aplicación seleccionada
 */

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
  //!Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<RAFSendData>();

  //!Navigation
  const navigate = useNavigate(); 

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

  // If the type is maintenance or barbecho and the sub_type is chemical, then fetch chemicals
  const shouldFetchChemicals =
    (selectedType === "mantenimiento_cultivo" &&
      (selectedSubType === "apl_agroquimico" ||
        selectedSubType === "apl_fertilizante")) ||
    (selectedType === "barbecho" && selectedSubType === "quimico") ||
    (selectedType === "encalado");

  // Get category by label
  const {
    data: products,
    isLoading: isLoadingProducts,
    categories: categoriesProducts,
  } = useGetProductsByCategory(shouldFetchChemicals, "Insumos");

  const [filteredProducts, setFilteredProducts] = useState<ProductsResponse[]>([]);

  //!Cusa
  const { data: cusa, isLoading: isLoadingCusa } = useCusa();

  //!Submit form - Create and update RAF
  const { createRAF } = useRegisters();
  const { mutate: createRAFMutation } = createRAF;

  const onSubmit = handleSubmit((data) => {
    const confirmation = window.prompt(
      "Para confirmar la creación del registro, escriba OK"
    );
    if (confirmation?.trim().toLowerCase() !== "ok") {
      return;
    }

    if (data.type === "encalado" && !data.sub_type) {
      data.sub_type = "encalado";
    }

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

  //!This is the product management state, its quite complex and important, so I'll explain it in detail.

  //! Search and Product Selection States
  const [searchQuery, setSearchQuery] = useState(""); // State for product search input
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]); // State for storing selected products
  const [editingProduct, setEditingProduct] = useState<SelectedProducts | null>(null); // State for product being edited in modal

  // Get warehouses for the selected product 
  const warehouses = useMemo(() => {
    return products?.find((p) => p.id === editingProduct?.id)?.warehouses.map((w) => ({
      ...w,
      id: w.id,
    })) || [];
  }, [products, editingProduct]);


  /**
   * Removes a product from the selected products list
   * @param productId - ID of the product to remove
   */
  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  /**
   * Updates the quantity of a selected product
   * Validates that quantity is greater than 0
   * @param productId - ID of the product to update
   * @param quantity - New quantity value
   */
  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setSelectedProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  /**
   * Prepares a product for editing in the modal
   * Transforms ProductResponse into SelectedProducts format
   * @param product - Product data from API
   */
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

  /**
   * Confirms the product being edited in the modal
   * Validates warehouse selection and quantity
   * Updates or adds the product to the selected products list
   */
  const handleConfirmProduct = () => {
    if (!editingProduct) return;

    // Validate warehouse selection
    if (!editingProduct.warehouse_id) {
      toast.error("Debe seleccionar un depósito");
      return;
    }

    // Validate quantity
    if (editingProduct.quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    // Update or add product to selection
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.id === editingProduct.id);
      if (exists) {
        return prev.map((p) =>
          p.id === editingProduct.id ? { ...editingProduct } : p
        );
      }
      return [...prev, editingProduct];
    });
    setEditingProduct(null); // Close modal
  };

  /**
   * Handles quantity changes in the edit modal
   * @param e - Input change event
   */
  const handleModalQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      quantity: parseFloat(e.target.value) || 0,
    });
  };

  /**
   * Handles warehouse selection changes in the edit modal
   * @param e - Select change event
   */
  const handleModalWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      warehouse_id: e.target.value,
    });
  };

  /**
   * Memoized list of available products
   * Filters out products that are already selected
   * Optimizes performance by preventing unnecessary recalculations
   */
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
                initialSubcategoryName={
                  selectedType === "encalado"
                    ? "Encalado"
                    : selectedSubType === "apl_fertilizante"
                    ? "Fertilizante"
                    : undefined
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
                  warehouses={warehouses}
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
