import { useLocation, useNavigate } from "react-router-dom";
import { ActionButtons, FormField, TotalAreaDisplay, LotSelection, CropInfoCard } from "../../../../ui/components";
import { useForm } from "react-hook-form";
import { IrrigationFertirriegoSendData } from "../../../../interfaces";
import { useCropAndLots } from "../../../../hooks/others/useCropAndLots";
import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useGetProductsByCategory, useIrrigation } from "../../../../hooks";
import { ProductsResponse, SelectedProducts } from "../../../../interfaces";
import { ProductCard, EditProductModal, ProductFilterWithTree } from "../../../../ui/components";
import { SelectedProductsList } from "../../../../ui/components/common/SelectedProductsList";

export const IrrigationFertirriego = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const irrigationData = location.state?.irrigationData;

    const { register, handleSubmit, formState: { errors }, control } = useForm<IrrigationFertirriegoSendData>()
    
    const { createIrrigationFertirriego } = useIrrigation();
    const {
        selectedLots,
        selectedSublots,
        selectedCrop,
        lots,
        isLoading: isLoadingCropAndLots,
        handleLotAreaChange,
        handleLotSelection,
        handleSublotSelection,
        handleSublotAreaChange,
      } = useCropAndLots(control, irrigationData.irrigation.crop_code);

    // Add new states for product handling
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>([]);
    const [editingProduct, setEditingProduct] = useState<SelectedProducts | null>(null);
    const [filteredProducts, setFilteredProducts] = useState<ProductsResponse[]>([]);

    // Fetch products
    const {
        data: products,
        isLoading: isLoadingProducts,
        categories: categoriesProducts,
    } = useGetProductsByCategory(true, "Insumos");

    // Product handling functions
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

    const handleModalQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!editingProduct) return;
        setEditingProduct({
            ...editingProduct,
            quantity: parseFloat(e.target.value) || 0,
        });
    };

    const handleModalWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!editingProduct) return;
        setEditingProduct({
            ...editingProduct,
            warehouse_id: e.target.value,
        });
    };

    // Available products memo
    const availableProducts = useMemo(() => {
        return products?.filter(
            (product) => !selectedProducts.some((selected) => selected.id === product.id)
        ) || [];
    }, [products, selectedProducts]);

    // Update onSubmit to include selected products
    const onSubmit = handleSubmit((data) => {
        if (selectedProducts.length === 0) {
            toast.error("Debe seleccionar al menos un producto");
            return;
        }
        
        data.crop_code = irrigationData.irrigation.crop_code;
        data.selectedLots = selectedLots;
        data.selectedSublots = selectedSublots;
        data.selectedMaterials = selectedProducts;
        
        createIrrigationFertirriego.mutate(data);
    });

    // Loading crops
    if (isLoadingCropAndLots || isLoadingProducts) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    return  <>
    <h1 className="text-2xl font-bold mb-4">
      Fertirriego - {irrigationData.irrigation.crop_code}
    </h1>

    <form onSubmit={onSubmit} className="w-full">
      <div className="w-full grid grid-cols-2 gap-4">
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

        <CropInfoCard crop={selectedCrop} />

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

          {/* Add Products Section before ActionButtons */}
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

          {/* Actions */}
          <ActionButtons
            onCancel={() => navigate("/irrigation/list")}
            onSubmit={onSubmit}
          />

      </div>
    </form>
  </>
}