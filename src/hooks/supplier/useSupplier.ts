import { useState, useCallback } from "react";
import { generateSupplierInvoicePDF, getSupplier } from "../../actions";
import { useBaseQuery } from "../config/useBaseQuery";
import { InvoiceElement, SupplierTotal } from "../../interfaces";

interface SelectedInvoice {
  invoice: InvoiceElement;
  currency: string;
  bankAccountId?: string;
}

export const useSupplier = () => {
    const [selectedInvoices, setSelectedInvoices] = useState<SelectedInvoice[]>([]);
    const [showPaymentOrderModal, setShowPaymentOrderModal] = useState(false);

    const listSupplier = useBaseQuery(
        ['supplier'],
        getSupplier
    );

    // Función helper para obtener cuentas bancarias válidas
    const getValidBankAccounts = (invoice: InvoiceElement) => {
        if (!invoice.bank_accounts || invoice.bank_accounts.length === 0) {
            return [];
        }
        
        return invoice.bank_accounts.filter(account => 
            (account.account_number && account.account_number.trim() !== '') || 
            (account.iban && account.iban.trim() !== '')
        );
    };

    const toggleInvoiceSelection = (invoice: InvoiceElement, currency: string, bankAccountId?: string) => {
        setSelectedInvoices(prev => {
            const existingIndex = prev.findIndex(item => item.invoice.invoice.id === invoice.invoice.id);
            if (existingIndex >= 0) {
                // Si ya existe pero cambia la moneda o la cuenta bancaria, actualiza
                if (prev[existingIndex].currency !== currency || prev[existingIndex].bankAccountId !== bankAccountId) {
                    const newItems = [...prev];
                    newItems[existingIndex] = { invoice, currency, bankAccountId };
                    return newItems;
                }
                // Si ya existe con la misma moneda y cuenta, lo elimina (toggle)
                return prev.filter(item => item.invoice.invoice.id !== invoice.invoice.id);
            } else {
                // Si no existe, lo agrega
                // Si no se proporciona una cuenta bancaria, usa la cuenta por defecto o la primera válida
                const validBankAccounts = getValidBankAccounts(invoice);
                const defaultBankAccount = validBankAccounts.length > 0 
                    ? (validBankAccounts.find(acc => acc.is_default) || validBankAccounts[0])
                    : null;
                return [...prev, { 
                    invoice, 
                    currency, 
                    bankAccountId: bankAccountId || defaultBankAccount?.id 
                }];
            }
        });
    };

    const isInvoiceSelected = (invoiceId: string) => {
        return selectedInvoices.some(item => item.invoice.invoice.id === invoiceId);
    };

    const getSelectedCurrency = (invoiceId: string) => {
        const item = selectedInvoices.find(item => item.invoice.invoice.id === invoiceId);
        return item ? item.currency : "UYU";
    };

    const getSelectedBankAccount = (invoiceId: string) => {
        const item = selectedInvoices.find(item => item.invoice.invoice.id === invoiceId);
        if (!item) return "";
        
        // Si no hay una cuenta bancaria seleccionada, usa la cuenta por defecto o la primera válida
        if (!item.bankAccountId) {
            const validBankAccounts = getValidBankAccounts(item.invoice);
            const defaultBankAccount = validBankAccounts.length > 0
                ? (validBankAccounts.find(acc => acc.is_default) || validBankAccounts[0])
                : null;
            return defaultBankAccount?.id || "";
        }
        
        return item.bankAccountId;
    };

    const clearSelectedInvoices = () => {
        setSelectedInvoices([]);
    };

    const generatePDF = (orderNumber: string) => {
        if (selectedInvoices.length === 0) return;
        generateSupplierInvoicePDF(selectedInvoices, orderNumber);
        setShowPaymentOrderModal(false);
    };

    const showPaymentOrderModalHandler = () => {
        setShowPaymentOrderModal(true);
    };

    const closePaymentOrderModal = () => {
        setShowPaymentOrderModal(false);
    };

    const availableCurrencies = ["UYU", "USD", "EFECTIVO_UYU", "EFECTIVO_USD"];

    // Obtener las facturas separadas por moneda
    const getInvoicesByCurrency = () => {
        const invoicesByCurrency = {
            UYU: selectedInvoices.filter(item => item.currency === "UYU").map(item => item.invoice),
            USD: selectedInvoices.filter(item => item.currency === "USD").map(item => item.invoice)
        };
        return invoicesByCurrency;
    };

    // Calcular totales para el modal
    const getTotalsForModal = useCallback(() => {
        if (selectedInvoices.length === 0) {
            return { totalUSD: 0, totalUYU: 0, supplierTotals: [] };
        }

        // Calcular totales por moneda
        const totalUSD = selectedInvoices
            .filter(item => item.currency === "USD" || item.currency === "EFECTIVO_USD")
            .reduce((sum, item) => {
                const amount = item.invoice.invoice.pending_amount || 
                    (item.invoice.invoice.currency.code === "USD" 
                        ? item.invoice.invoice.currency.total_ttc
                        : item.invoice.invoice.total_ttc);
                return sum + amount;
            }, 0);

        const totalUYU = selectedInvoices
            .filter(item => item.currency === "UYU" || item.currency === "EFECTIVO_UYU")
            .reduce((sum, item) => {
                const amount = item.invoice.invoice.pending_amount || 
                    (item.invoice.invoice.currency.code === "UYU" 
                        ? item.invoice.invoice.currency.total_ttc
                        : item.invoice.invoice.total_ttc);
                return sum + amount;
            }, 0);

        // Calcular totales por proveedor
        const supplierTotalsMap = new Map<string, SupplierTotal>();
        
        selectedInvoices.forEach(item => {
            const supplierId = item.invoice.supplier.id;
            const supplierName = item.invoice.supplier.name;
            const amount = item.invoice.invoice.pending_amount || 
                (item.invoice.invoice.currency.code === item.currency 
                    ? item.invoice.invoice.currency.total_ttc
                    : item.invoice.invoice.total_ttc);
            
            if (!supplierTotalsMap.has(supplierId)) {
                supplierTotalsMap.set(supplierId, {
                    supplierId,
                    supplierName,
                    invoicesCount: 0,
                    totalUSD: 0,
                    totalUYU: 0
                });
            }
            
            const supplier = supplierTotalsMap.get(supplierId)!;
            supplier.invoicesCount++;
            
            if (item.currency === 'USD' || item.currency === 'EFECTIVO_USD') {
                supplier.totalUSD += amount;
            } else {
                supplier.totalUYU += amount;
            }
        });

        const supplierTotals = Array.from(supplierTotalsMap.values())
            .sort((a, b) => a.supplierName.localeCompare(b.supplierName));

        return { totalUSD, totalUYU, supplierTotals };
    }, [selectedInvoices]);

    return {
        listSupplier,
        selectedInvoices,
        toggleInvoiceSelection,
        isInvoiceSelected,
        getSelectedCurrency,
        getSelectedBankAccount,
        clearSelectedInvoices,
        generatePDF,
        showPaymentOrderModalHandler,
        closePaymentOrderModal,
        showPaymentOrderModal,
        getTotalsForModal,
        availableCurrencies,
        getInvoicesByCurrency
    };
};