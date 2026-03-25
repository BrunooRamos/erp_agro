import { useState } from "react";
import { useBaseQuery } from "../config/useBaseQuery";
import { AvailableAccountsResponse, SupplierDueReport, SupplierDueReportFilters } from "../../interfaces";
import { getAvailableAccounts, getSupplierDueReport } from "../../actions/supplier/supplier_actions";

export const useSupplierDueReport = () => {
  const today = new Date();
  const firstOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const toISO = (d: Date) => d.toISOString().slice(0, 10);

  const [filters, setFilters] = useState<SupplierDueReportFilters>({
    account: "",
    date_from: toISO(firstOfMonth),
    date_to: toISO(today),
    supplier_id: "",
    currency: "",
  });

  const accounts = useBaseQuery<AvailableAccountsResponse>(
    ["available-accounts"],
    () => getAvailableAccounts(),
    { staleTime: 5 * 60 * 1000 }
  );

  const report = useBaseQuery<SupplierDueReport>(
    ["supplier-due-report", JSON.stringify(filters)],
    () => getSupplierDueReport(filters),
    { enabled: Boolean(filters.account && filters.date_from && filters.date_to) }
  );

  const updateFilters = (partial: Partial<SupplierDueReportFilters>) => {
    setFilters(prev => ({ ...prev, ...partial }));
  };

  const clearFilters = () => {
    setFilters({
      account: "",
      date_from: toISO(firstOfMonth),
      date_to: toISO(today),
      supplier_id: "",
      currency: "",
    });
  };

  return {
    filters,
    updateFilters,
    clearFilters,
    accounts,
    report,
  };
};


