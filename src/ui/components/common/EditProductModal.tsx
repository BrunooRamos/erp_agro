import { SelectedProducts, Warehouse } from "../../../interfaces";

interface EditProductModalProps {
  editingProduct: SelectedProducts;
  warehouses: Warehouse[];
  onClose: () => void;
  onConfirm: (product: SelectedProducts) => void;
  onChangeQuantity: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeWarehouse: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  title?: string;
  confirmButtonDisabled?: boolean;
  seeds?: boolean;
}

export const EditProductModal = ({
  editingProduct,
  warehouses,
  onClose,
  onConfirm,
  onChangeQuantity,
  onChangeWarehouse,
  title = "Agregar producto",
  confirmButtonDisabled = !editingProduct?.warehouse_id,
}: EditProductModalProps) => {
  if (!editingProduct) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 ease-in-out">
        <h3 className="text-xl font-semibold mb-4 text-zinc-800">{title}</h3>
        <p className="text-zinc-600 mb-6 font-medium">{editingProduct.label}</p>

        {/* Warehouse Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Depósito <span className="text-red-500">*</span>
          </label>
          <select
            title="Seleccionar depósito"
            value={editingProduct.warehouse_id || ""}
            onChange={onChangeWarehouse}
            className="w-full px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
          >
            <option value="">Seleccionar depósito</option>
            {warehouses?.map((warehouse) => (
              <option key={warehouse.id} value={warehouse.id}>
                {warehouse.ref +
                  " - Stock: " +
                  warehouse.stock +
                  " " +
                  editingProduct.type}
              </option>
            ))}
          </select>
        </div>

        {/* Quantity Input */}
        <div className="flex items-center gap-3 mb-8">
          <input
            type="number"
            value={editingProduct.quantity || ""}
            onChange={onChangeQuantity}
            className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
            min="0.5"
            step="0.5"
            placeholder="Cantidad"
          />
          <span className="text-zinc-600 font-medium">
            {editingProduct.unit}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 text-zinc-600 hover:text-zinc-800 font-medium transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onConfirm(editingProduct)}
            className="px-6 py-2.5 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:bg-zinc-300 disabled:cursor-not-allowed font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={confirmButtonDisabled}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};
