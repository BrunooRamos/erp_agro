import { CategoryResponse } from "../../../interfaces";



interface ProductFiltersProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedSubcategory?: string;
  onSubcategoryChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  subcategories?: CategoryResponse;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedSubcategory,
  onSubcategoryChange,
  subcategories,
}) => (
  <div className="mb-3 flex gap-3">
    <div className="flex-1 relative">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder="Buscar productos..."
        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
      />
      <svg
        className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    {subcategories && (
      <select
        title="Filtrar por subcategoría"
        value={selectedSubcategory}
        onChange={onSubcategoryChange}
        className="w-64 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
      >
        <option value="">Todas las subcategorías</option>
        <option key={subcategories.rowid} value={subcategories.label}>
          {subcategories.label}
        </option>
        {subcategories.subcategories?.map((subcat) => (
          <option key={subcat.rowid} value={subcat.label}>
            {subcat.label}
          </option>
        ))}
      </select>
    )}
  </div>
);
