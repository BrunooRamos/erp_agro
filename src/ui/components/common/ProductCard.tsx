import { ProductsResponse } from "../../../interfaces";

export const ProductCard = ({ product, onSelectProduct  }: { product: ProductsResponse, onSelectProduct: (product: ProductsResponse) => void }) => (
    <div 
      className="group flex flex-col p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200"
    >
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-gray-900">{product.label}</h3>
            <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
              {product.ref}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {product.subcategory_name}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelectProduct(product)}
          className="px-4 py-2 text-sm bg-zinc-800 text-white rounded-md hover:bg-zinc-700 transition-colors duration-200 flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Agregar
        </button>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-4 pt-3 border-t border-gray-100">
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Presentación</span>
          <span className="text-sm text-gray-700">{product.array_options.options_presentacion || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Medida</span>
          <span className="text-sm text-gray-700">{product.array_options.options_medida || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Tipo</span>
          <span className="text-sm text-gray-700">{product.array_options.options_tipo_presentacion || '-'}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500">Dosis/Ha</span>
          <span className="text-sm text-gray-700">{product.array_options.options_dosisha || '-'}</span>
        </div>
      </div>
    </div>
  );