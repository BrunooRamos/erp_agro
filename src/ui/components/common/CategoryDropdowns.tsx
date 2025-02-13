// src/ui/components/common/CategoryDropdowns.tsx
import { useState } from 'react';
import { CategoryResponse } from '../../../interfaces';

interface CategoryDropdownsProps {
  categories: CategoryResponse;
  onChange: (categoryId: number) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CategoryDropdowns = ({ 
  categories, 
  onChange,
  searchQuery,
  onSearchChange
}: CategoryDropdownsProps) => {
  const [selectedCategories, setSelectedCategories] = useState<{[key: number]: CategoryResponse}>({});
  
  const handleCategoryChange = (level: number, category: CategoryResponse | null) => {
    const newSelected = { ...selectedCategories };
    
    if (!category) {
      Object.keys(newSelected).forEach(key => {
        if (Number(key) >= level) {
          delete newSelected[Number(key)];
        }
      });
    } else {
      newSelected[level] = category;
      Object.keys(newSelected).forEach(key => {
        if (Number(key) > level) {
          delete newSelected[Number(key)];
        }
      });
    }
    
    setSelectedCategories(newSelected);
    
    if (!category) {
      onChange(0);
    } else {
      const lastSelectedCategory = Object.values(newSelected).pop();
      if (lastSelectedCategory) {
        onChange(lastSelectedCategory.rowid);
      }
    }
  };

  const renderDropdown = (level: number, currentCategories: CategoryResponse) => {
    const selectedCategory = selectedCategories[level];
    const hasSubcategories = currentCategories?.subcategories && currentCategories.subcategories.length > 0;

    return (
      <>
        <div className="w-64">
          <select
            title="Seleccionar categoría"
            value={selectedCategory?.rowid || ""}
            onChange={(e) => {
              if (e.target.value === "0") {
                handleCategoryChange(level, null);
                return;
              }
              
              const category = e.target.value && hasSubcategories
                ? currentCategories.subcategories?.find(c => c.rowid === Number(e.target.value)) || null
                : null;
              handleCategoryChange(level, category);
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
          >
            <option value="0">Todos los productos</option>
            {hasSubcategories && currentCategories.subcategories.map((category) => (
              <option key={category.rowid} value={category.rowid}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {selectedCategory && 
         selectedCategory.subcategories && 
         selectedCategory.subcategories.length > 0 && (
          <div className="ml-2">
            {renderDropdown(level + 1, selectedCategory)}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      <div className="relative w-64">
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

      {categories && renderDropdown(0, categories)}
    </div>
  );
};