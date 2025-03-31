import React, { useState } from 'react';

interface Category {
  rowid: number;
  label: string;
  parent_id: number;
  description: string;
  subcategories: Category[];
}

interface MultiLevelDropdownProps {
  category?: Category; // Make category optional
  onChange: (selectedChain: Category[]) => void;
}

const MultiLevelDropdown: React.FC<MultiLevelDropdownProps> = ({ category, onChange }) => {
  const [selectedChain, setSelectedChain] = useState<Category[]>([]);

  // If no category is provided, return null or a placeholder
  if (!category) {
    return null;
  }

  const handleSelect = (level: number, rowid: number) => {
    const newChain = selectedChain.slice(0, level);
    const currentOptions = level === 0 
      ? category?.subcategories || [] 
      : newChain[level - 1]?.subcategories || [];
    const selectedOption = currentOptions.find(cat => cat.rowid === rowid);

    if (selectedOption) {
      newChain[level] = selectedOption;
      setSelectedChain(newChain);
      onChange(newChain);
    } else {
      setSelectedChain(newChain);
      onChange(newChain);
    }
  };

  const renderDropdown = (options: Category[], level: number) => {
    const selectedValue = selectedChain[level]?.rowid || '';
    return (
      <select
        title={`Dropdown ${level}`}
        key={level}
        value={selectedValue}
        onChange={(e) => handleSelect(level, Number(e.target.value))}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
      >
        <option value="">Seleccione una opción</option>
        {options.map((option, index) => (
          <option key={`${option.rowid}-${level}-${index}`} value={option.rowid}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };

  const dropdowns = [];
  let currentOptions = category.subcategories || [];
  let level = 0;
  
  if (currentOptions.length > 0) {
    dropdowns.push(renderDropdown(currentOptions, level));
  }
  
  while (selectedChain[level]?.subcategories?.length > 0) {
    level++;
    currentOptions = selectedChain[level - 1]?.subcategories || [];
    dropdowns.push(renderDropdown(currentOptions, level));
  }

  return (
    <div className="flex flex-col gap-2">
      {dropdowns.map((dropdown, index) => (
        <div key={index}>{dropdown}</div>
      ))}
    </div>
  );
};

export default MultiLevelDropdown; 