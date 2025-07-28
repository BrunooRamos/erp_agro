import { useState, useMemo } from "react";
import { useBaseQuery } from "../config/useBaseQuery";
import { getThirdparties } from "../../actions/supplier/supplier_actions";
import { ThirdpartyFilters, Thirdparty } from "../../interfaces";

export const useThirdparties = (initialFilters: ThirdpartyFilters = {}) => {
  const [filters, setFilters] = useState<ThirdpartyFilters>(initialFilters);

  const thirdpartiesQuery = useBaseQuery(
    ['thirdparties', JSON.stringify(filters)],
    () => getThirdparties(filters)
  );

  // Obtener solo proveedores
  const getSuppliers = () => {
    return getThirdparties({ ...filters, mode: 2 });
  };

  // Obtener solo clientes
  const getClients = () => {
    return getThirdparties({ ...filters, mode: 1 });
  };

  // Query específica para proveedores
  const suppliersQuery = useBaseQuery(
    ['suppliers', JSON.stringify(filters)],
    () => getSuppliers()
  );

  // Query específica para clientes
  const clientsQuery = useBaseQuery(
    ['clients', JSON.stringify(filters)],
    () => getClients()
  );

  // Filtrar terceros según su tipo
  const filteredThirdparties = useMemo(() => {
    if (!thirdpartiesQuery.data) return [];
    
    return thirdpartiesQuery.data.filter((thirdparty: Thirdparty) => {
      if (filters.mode === 1) return thirdparty.client === "1"; // Solo clientes
      if (filters.mode === 2) return thirdparty.fournisseur === "1"; // Solo proveedores
      if (filters.mode === 3) return thirdparty.client === "2"; // Solo prospectos
      return true; // Todos los terceros
    });
  }, [thirdpartiesQuery.data, filters.mode]);

  const updateFilters = (newFilters: Partial<ThirdpartyFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  return {
    // Queries
    thirdpartiesQuery,
    suppliersQuery,
    clientsQuery,
    
    // Data
    thirdparties: filteredThirdparties,
    suppliers: suppliersQuery.data || [],
    clients: clientsQuery.data || [],
    
    // Loading states
    isLoading: thirdpartiesQuery.isLoading,
    isLoadingSuppliers: suppliersQuery.isLoading,
    isLoadingClients: clientsQuery.isLoading,
    
    // Error states
    error: thirdpartiesQuery.error,
    
    // Filter management
    filters,
    updateFilters,
    clearFilters,
    
    // Actions
    refetch: thirdpartiesQuery.refetch,
    refetchSuppliers: suppliersQuery.refetch,
    refetchClients: clientsQuery.refetch
  };
};