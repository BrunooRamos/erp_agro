import React, { useState, useMemo, useEffect } from 'react';
import MultiLevelDropdown from './MultiLevelDropdown';
import { CategoryResponse, ProductsResponse } from '../../../interfaces';


interface ProductFilterWithTreeProps {
  products: ProductsResponse[];
  categories: CategoryResponse;
  onProductsFiltered: (products: ProductsResponse[]) => void;
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  initialSubcategoryName?: string;
}

export const ProductFilterWithTree: React.FC<ProductFilterWithTreeProps> = ({ 
  products, 
  categories, 
  onProductsFiltered,
  searchQuery,
  onSearchChange,
  initialSubcategoryName
}) => {
  const [selectedChain, setSelectedChain] = useState<CategoryResponse[]>([]);

  // Initialize with default subcategory when provided
  useEffect(() => {
    if (initialSubcategoryName && categories && selectedChain.length === 0) {
      const findCategoryByName = (cat: CategoryResponse, targetName: string): CategoryResponse[] | null => {
        if (cat.label === targetName) {
          return [cat];
        }
        for (const subcat of cat.subcategories) {
          const result = findCategoryByName(subcat, targetName);
          if (result) {
            return [cat, ...result];
          }
        }
        return null;
      };

      const chain = findCategoryByName(categories, initialSubcategoryName);
      if (chain) {
        setSelectedChain(chain);
      }
    }
  }, [initialSubcategoryName, categories, selectedChain.length]);

  const handleCategoryChange = (chain: CategoryResponse[]) => {
    setSelectedChain(chain);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filtrar por categorías
    if (selectedChain.length > 0) {
      const lastSelected = selectedChain[selectedChain.length - 1];
      const validIds = getAllCategoryIds(lastSelected);
      filtered = filtered.filter(product => validIds.includes(Number(product.subcategory_id)));
    }

    // Filtrar por búsqueda
    if (searchQuery) {
      filtered = filtered.filter(product => 
        product.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedChain, searchQuery]);

  // Move the filtering logic into a useEffect with proper dependencies
  useEffect(() => {
    onProductsFiltered(filteredProducts);
  }, [filteredProducts, onProductsFiltered]);


  return (
    <div className="space-y-4">
      <div className="relative">
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
      {categories && <MultiLevelDropdown category={categories} onChange={handleCategoryChange} />}
    </div>
  );
};

function getAllCategoryIds(category: CategoryResponse): number[] {
  const ids = [category.rowid];
  category.subcategories.forEach(sub => {
    ids.push(...getAllCategoryIds(sub));
  });
  return ids;
} 