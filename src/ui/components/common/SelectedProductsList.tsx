import { SelectedProducts } from "../../../interfaces";

export const SelectedProductsList = ({ selectedProducts, onUpdateQuantity, onRemoveProduct }: { selectedProducts: SelectedProducts[], onUpdateQuantity: (id: string, quantity: number) => void, onRemoveProduct: (id: string) => void}) => {
    if (selectedProducts.length === 0) return null;
    return (
      <div className="mb-6">
        <div className="space-y-3">
          {selectedProducts.map((product) => (
            <div 
              key={product.id} 
              className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="font-medium text-gray-800">{product.label}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <input
                    title="Cantidad"
                    type="number"
                    value={product.quantity}
                    onChange={(e) => onUpdateQuantity(product.id, Number(e.target.value))}
                    className="w-28 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    min="0.01"
                    step="0.01"
                  />
                  <span className="text-sm text-gray-600">
                    {product.unit}
                  </span>
                </div>
                <button
                  title="Eliminar producto"
                  type="button"
                  onClick={() => onRemoveProduct(product.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };