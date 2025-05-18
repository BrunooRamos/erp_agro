import { useForm } from "react-hook-form";
import { useGetProductsByCategory, useMachinery } from "../../../../hooks";
import {
  MaintenanceFormData,
  ProductsResponse,
  SelectedProducts,
} from "../../../../interfaces";
import {
  ActionButtons,
  FormField,
  ProductCard,
  ProductFilterWithTree,
  SelectedProductsList,
} from "../../../../ui/components";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const FormMaintenance = () => {
  const navigate = useNavigate();

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MaintenanceFormData>();

  // Maquinaria
  const { listMachinery, createMaintenance } = useMachinery(null);
  const { data: machinery = [], isLoading: isLoadingMachinery } = listMachinery;

  // Productos
  const {
    data: products = [],
    isLoading: isLoadingProducts,
    categories: categoriesProducts = null,
  } = useGetProductsByCategory(true, "Repuestos");

  // Estado para productos
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<ProductsResponse[]>(
    []
  );
  const [selectedProducts, setSelectedProducts] = useState<SelectedProducts[]>(
    []
  );

  const handleSelectProduct = (product: ProductsResponse) => {
    if (!product.warehouses || product.warehouses.length === 0) {
      return;
    }

    const newProduct: SelectedProducts = {
      id: product.id,
      label: product.label,
      quantity: 1,
      unit: "unidad",
      presentation: 1,
      warehouse_id: product.warehouses[0].id.toString(),
    };
    setSelectedProducts((prev) => [...prev, newProduct]);
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setSelectedProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, quantity } : product
      )
    );
  };

  const handleRemoveProduct = (id: string) => {
    setSelectedProducts((prev) => prev.filter((product) => product.id !== id));
  };

  // Submit
  const { mutate: createMaintenanceMutation } = createMaintenance;

  const onSubmit = (data: MaintenanceFormData) => {
    const formData: MaintenanceFormData = {
      ...data,
      products: selectedProducts.map((product) => ({
        product_id: product.id,
        quantity: product.quantity,
        warehouse_id: product.warehouse_id,
      })),
    };
    reset();
    createMaintenanceMutation(formData, {
      onSuccess: () => {
        navigate("/machinery");
      },
    });
  };

  if (isLoadingProducts || isLoadingMachinery) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Mantenimiento </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        <div className="grid grid-cols-2 gap-6">
          <FormField
            label="Maquinaria"
            error={errors.machinery_id?.message}
            required
          >
            <select
              {...register("machinery_id", {
                required: "Este campo es requerido",
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccione una maquinaria</option>
              {machinery.map((machine) => (
                <option key={machine.rowid} value={machine.rowid}>
                  {machine.name} - {machine.brand} {machine.model}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Fecha" error={errors.date?.message} required>
            <input
              type="date"
              {...register("date", { required: "Este campo es requerido" })}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Gastos extras"
            error={errors.other_expenses?.message}
          >
            <input
              {...register("other_expenses")}
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ingrese los gastos extras"
            />
          </FormField>

          <FormField
            label="Descripción de gastos"
            error={errors.expenses_description?.message}
          >
            <textarea
              {...register("expenses_description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              placeholder="Ingrese la descripción de los gastos extras"
            />
          </FormField>

          <FormField
            label="Descripción general"
            error={errors.general_description?.message}
          >
            <textarea
              {...register("general_description")}
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              placeholder="Ingrese la descripción general"
            />
          </FormField>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">
            Productos utilizados
          </h3>

          {categoriesProducts && (
            <ProductFilterWithTree
              products={products || []}
              categories={categoriesProducts}
              onProductsFiltered={setFilteredProducts}
              searchQuery={searchQuery}
              onSearchChange={(e) => setSearchQuery(e.target.value)}
            />
          )}

          <div className="grid grid-cols-1 gap-4 mt-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelectProduct={handleSelectProduct}
              />
            ))}
          </div>

          <SelectedProductsList
            selectedProducts={selectedProducts}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveProduct={handleRemoveProduct}
          />
        </div>

        <ActionButtons
          onCancel={() => navigate("/registers")}
          onSubmit={() => handleSubmit(onSubmit)}
        />
      </form>
    </div>
  );
};
