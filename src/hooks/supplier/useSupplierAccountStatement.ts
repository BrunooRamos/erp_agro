import { AccountStatementFilters } from "../../interfaces";
import { getSupplierAccountStatement } from "../../actions/supplier/supplier_actions";
import { useBaseQuery } from "../config/useBaseQuery";
import { useState } from "react";

export const useSupplierAccountStatement = () => {
    const [filters, setFilters] = useState<AccountStatementFilters>({
      currency: 'USD',
      only_pending: false
    });
  
    const accountStatement = useBaseQuery(
      ['supplier-account-statement', JSON.stringify(filters)],
      () => getSupplierAccountStatement(filters),
      {
        enabled: !!filters.supplier_id
      }
    );
  
    const updateFilters = (newFilters: Partial<AccountStatementFilters>) => {
      setFilters(prev => ({ ...prev, ...newFilters }));
    };
  
    const clearFilters = () => {
      setFilters({
        currency: 'USD',
        only_pending: false
      });
    };
  
    return {
      accountStatement,
      filters,
      updateFilters,
      clearFilters
    };
  };