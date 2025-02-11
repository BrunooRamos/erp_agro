import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ProductsResponse,
  SeedMapRegisterInterface,
  SelectedProducts,
} from "../../../../interfaces/index";
import {
  ActionButtons,
  ProductFilters,
  CropInfoCard,
  EditProductModal,
  FormField,
  LotSelection,
  ProductCard,
  SelectedProductsList,
  TotalAreaDisplay,
} from "../../../../ui/components";
import {
  useCropAndLots,
  useCusa,
  useGetProductsByCategory,
  useListMachinery,
  useRegisters,
} from "../../../../hooks";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const SeedMapRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    setValue,
    reset,
  } = useForm<SeedMapRegisterInterface>();

  //!Crops and lots
  const {
    selectedLots,
    lots,
    sortedCrops,
    selectedCrop,
    isLoading: isLoadingCropAndLots,
    handleLotAreaChange,
    handleLotSelection,
  } = useCropAndLots(control);

  //!Machinery
  const { data: machinery, isLoading: isLoadingMachinery } = useListMachinery();

  //!Cusa
  const { data: cusa, isLoading: isLoadingCusa } = useCusa();
  const selectedLabor = watch("labor");

  // Actualiza el costo cusa según el labor seleccionado
  useEffect(() => {
    if (selectedLabor && cusa) {
      const selectedCusaItem = cusa.find(
        (item) => item.cod_laboreo === selectedLabor
      );
      if (selectedCusaItem) {
        setValue("cusa_cost", selectedCusaItem.precio_cusa);
        setValue("lts", selectedCusaItem.lts_ha);
      }
    }
  }, [selectedLabor, cusa, setValue]);

  //!Seed and variety
  const { data: seeds, isLoading: isLoadingSeeds } = useGetProductsByCategory(
    true,
    "Semillas"
  );

  // Search query for seeds
  const [searchQuerySeeds, setSearchQuerySeeds] = useState("");

  // Editing seed
  const [editingSeed, setEditingSeed] = useState<SelectedProducts | null>(null);

  // Selected seeds
  const [selectedSeeds, setSelectedSeeds] = useState<SelectedProducts[]>([]);

  // Remove seed from selected seeds
  const handleRemoveSeed = (seedId: string) => {
    setSelectedSeeds((prev) => prev.filter((s) => s.id !== seedId));
  };

  // Update quantity of selected seed
  const handleUpdateSeedQuantity = (seedId: string, quantity: number) => {
    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setSelectedSeeds((prev) =>
      prev.map((s) => (s.id === seedId ? { ...s, quantity } : s))
    );
  };

  // Update handler functions for seeds
  const handleSelectSeed = (seed: ProductsResponse) => {
    setEditingSeed({
      id: seed.id,
      label: seed.label,
      unit: seed.array_options.options_medida || "u",
      presentation: +seed.array_options.options_presentacion,
      type: seed.array_options.options_tipo_presentacion,
      quantity: 0,
      warehouse_id: "",
    });
  };

  const handleConfirmSeed = (seed: SelectedProducts) => {
    setSelectedSeeds((prev) => [...prev, seed]);
    setEditingSeed(null);
  };

  const handleModalQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (editingSeed) {
      setEditingSeed({
        ...editingSeed,
        quantity: parseFloat(e.target.value) || 0,
      });
    }
  };

  const handleModalWarehouseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (editingSeed) {
      setEditingSeed({
        ...editingSeed,
        warehouse_id: e.target.value,
      });
    }
  };

  // Add after the searchQuerySeeds state
  const [selectedSeedSubcategory, setSelectedSeedSubcategory] = useState<string>("");

  // Get unique subcategories for seeds
  const seedSubcategories = seeds
    ? [...new Set(seeds.map((product) => product.subcategory_name))].sort()
    : [];

  //!Agrochemicals
  const { data: chemicals, isLoading: isLoadingChemicals } =
    useGetProductsByCategory(true, "Agroquimicos");

  // Search query for chemicals
  const [searchQueryChemicals, setSearchQueryChemicals] = useState("");

  // Editing chemical
  const [editingChemical, setEditingChemical] =
    useState<SelectedProducts | null>(null);

  // Selected chemicals
  const [selectedChemicals, setSelectedChemicals] = useState<
    SelectedProducts[]
  >([]);

  // Remove chemical from selected chemicals
  const handleRemoveChemical = (chemicalId: string) => {
    setSelectedChemicals((prev) => prev.filter((c) => c.id !== chemicalId));
  };

  // Update quantity of selected chemical
  const handleUpdateChemicalQuantity = (
    chemicalId: string,
    quantity: number
  ) => {
    if (quantity <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setSelectedChemicals((prev) =>
      prev.map((c) => (c.id === chemicalId ? { ...c, quantity } : c))
    );
  };

  // Update handler functions for chemicals
  const handleSelectChemical = (chemical: ProductsResponse) => {
    setEditingChemical({
      id: chemical.id,
      label: chemical.label,
      unit: chemical.array_options.options_medida || "u",
      presentation: +chemical.array_options.options_presentacion,
      type: chemical.array_options.options_tipo_presentacion,
      quantity: 0,
      warehouse_id: "",
    });
  };

  const handleConfirmChemical = (chemical: SelectedProducts) => {
    setSelectedChemicals((prev) => [...prev, chemical]);
    setEditingChemical(null);
  };

  const handleChemicalModalQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (editingChemical) {
      setEditingChemical({
        ...editingChemical,
        quantity: parseFloat(e.target.value) || 0,
      });
    }
  };

  const handleChemicalModalWarehouseChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    if (editingChemical) {
      setEditingChemical({
        ...editingChemical,
        warehouse_id: e.target.value,
      });
    }
  };

  const [selectedChemicalSubcategory, setSelectedChemicalSubcategory] = useState<string>("");

  // Get unique subcategories
  const chemicalSubcategories = chemicals
    ? [...new Set(chemicals.map((product) => product.subcategory_name))].sort()
    : [];


  //!Submit
  const { createSeedMap } = useRegisters();
  const { mutate: createSeedMapMutation } = createSeedMap;

  const onSubmit = handleSubmit((data) => {
    data.selectedLots = selectedLots;
    data.selectedSeeds = selectedSeeds;
    data.selectedChemicals = selectedChemicals;

    createSeedMapMutation(data, {
        onSuccess: () => {
          navigate("/registers");
          reset();
        },
      });
  });

  const navigate = useNavigate();

  if (
    isLoadingCropAndLots ||
    isLoadingMachinery ||
    isLoadingCusa ||
    isLoadingSeeds ||
    isLoadingChemicals
  ) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Crear Registro de Mapa de Siembra
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
                {sortedCrops?.map((crop) => (
                  <option key={crop.code} value={crop.code}>
                    {crop.code}
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
                selectedLots={selectedLots}
                onSelect={handleLotSelection}
                onAreaChange={handleLotAreaChange}
              />
            </div>

            {/* Total applied area */}
            <TotalAreaDisplay selectedLots={selectedLots} />

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
                    {machinery.name}
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
                    {machinery.name}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Cusa information */}
            <FormField
              label="Cusa"
              error={errors.labor?.message || ""}
              required
            >
              <select
                {...register("labor", {
                  required: "Este campo es requerido",
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              >
                <option value="">Seleccione una cusa</option>
                {cusa?.map((labor) => (
                  <option key={labor.cod_laboreo} value={labor.cod_laboreo}>
                    {labor.laboreo}
                  </option>
                ))}
              </select>
            </FormField>

            {/* Cusa Cost */}
            <FormField
              label="Costo de cusa"
              error={errors.cusa_cost?.message || ""}
            >
              <input
                {...register("cusa_cost", {
                  min: {
                    value: 0,
                    message: "El costo debe ser mayor a 0",
                  },
                })}
                name="cusa_cost"
                placeholder="100"
                type="number"
                step="0.01"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            {/* Lts Field */}
            <FormField label="Lts/ha" error={errors.lts?.message || ""}>
              <input
                {...register("lts", {
                  min: {
                    value: 0,
                    message: "El costo debe ser mayor a 0",
                  },
                })}
                name="lts"
                placeholder="100"
                type="number"
                step="0.01"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            {/* Grooves */}
            <FormField
              label="Número de surcos"
              error={errors.grooves?.message || ""}
            >
              <input
                {...register("grooves")}
                name="grooves"
                placeholder="100"
                type="number"
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              />
            </FormField>

            {/* Seed and variety */}
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Semillas <span className="text-red-500">*</span>
              </label>

              <ProductFilters
                searchQuery={searchQuerySeeds}
                onSearchChange={(e) => setSearchQuerySeeds(e.target.value)}
                selectedSubcategory={selectedSeedSubcategory}
                onSubcategoryChange={(e) => setSelectedSeedSubcategory(e.target.value)}
                subcategories={seedSubcategories}
              />

              <SelectedProductsList
                selectedProducts={selectedSeeds}
                onUpdateQuantity={handleUpdateSeedQuantity}
                onRemoveProduct={handleRemoveSeed}
              />
              {editingSeed && (
                <EditProductModal
                  editingProduct={editingSeed}
                  warehouses={
                    seeds?.find((s) => s.id === editingSeed?.id)?.warehouses ||
                    []
                  }
                  onClose={() => setEditingSeed(null)}
                  onConfirm={handleConfirmSeed}
                  onChangeQuantity={handleModalQuantityChange}
                  onChangeWarehouse={handleModalWarehouseChange}
                  title="Agregar semilla"
                  confirmButtonDisabled={
                    !editingSeed?.warehouse_id || !editingSeed?.quantity
                  }
                />
              )}

              <div className="grid grid-cols-1 gap-3 max-h-[32rem] overflow-y-auto px-1">
                {seeds
                  ?.filter(
                    (seed) =>
                      // Excluye las semillas ya seleccionadas
                      !selectedSeeds.some(
                        (selected) => selected.id === seed.id
                      ) &&
                      // Aplica filtros de búsqueda y subcategoría
                      (seed.label
                        .toLowerCase()
                        .includes(searchQuerySeeds.toLowerCase()) ||
                        seed.ref
                          .toLowerCase()
                          .includes(searchQuerySeeds.toLowerCase())) &&
                      (!selectedSeedSubcategory ||
                        seed.subcategory_name === selectedSeedSubcategory)
                  )
                  .map((seed) => (
                    <ProductCard
                      key={seed.id}
                      product={seed}
                      onSelectProduct={handleSelectSeed}
                    />
                  ))}
              </div>
            </div>

            {/* Chemicals section */}
            <div className="col-span-2 mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agroquímicos <span className="text-red-500">*</span>
              </label>

              <ProductFilters
                searchQuery={searchQueryChemicals}
                onSearchChange={(e) => setSearchQueryChemicals(e.target.value)}
                selectedSubcategory={selectedChemicalSubcategory}
                onSubcategoryChange={(e) => setSelectedChemicalSubcategory(e.target.value)}
                subcategories={chemicalSubcategories}
              />

              <SelectedProductsList
                selectedProducts={selectedChemicals}
                onUpdateQuantity={handleUpdateChemicalQuantity}
                onRemoveProduct={handleRemoveChemical}
              />

              {editingChemical && (
                <EditProductModal
                  editingProduct={editingChemical}
                  warehouses={
                    chemicals?.find((c) => c.id === editingChemical?.id)
                      ?.warehouses || []
                  }
                  onClose={() => setEditingChemical(null)}
                  onConfirm={handleConfirmChemical}
                  onChangeQuantity={handleChemicalModalQuantityChange}
                  onChangeWarehouse={handleChemicalModalWarehouseChange}
                  title="Agregar agroquímico"
                  confirmButtonDisabled={
                    !editingChemical?.warehouse_id || !editingChemical?.quantity
                  }
                />
              )}

              <div className="grid grid-cols-1 gap-3 max-h-[32rem] overflow-y-auto px-1">
                {chemicals
                  ?.filter(
                    (chemical) =>
                      !selectedChemicals.some(
                        (selected) => selected.id === chemical.id
                      ) &&
                      (chemical.label
                        .toLowerCase()
                        .includes(searchQueryChemicals.toLowerCase()) ||
                        chemical.ref
                          .toLowerCase()
                          .includes(searchQueryChemicals.toLowerCase())) &&
                      (!selectedChemicalSubcategory ||
                        chemical.subcategory_name === selectedChemicalSubcategory)
                  )
                  .map((chemical) => (
                    <ProductCard
                      key={chemical.id}
                      product={chemical}
                      onSelectProduct={handleSelectChemical}
                    />
                  ))}
              </div>
            </div>

            {/* RAF */}

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
