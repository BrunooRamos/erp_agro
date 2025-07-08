import { useState } from "react";
import { generateSupplierInvoicePDF, getSupplier } from "../../actions";
import { useBaseQuery } from "../config/useBaseQuery";
import { InvoiceElement } from "../../interfaces";

interface SelectedInvoice {
  invoice: InvoiceElement;
  currency: string;
  bankAccountId?: string;
}

export const useSupplier = () => {
    const [selectedInvoices, setSelectedInvoices] = useState<SelectedInvoice[]>([]);

    const listSupplier = useBaseQuery(
        ['supplier'],
        getSupplier
    );

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
                // Si no se proporciona una cuenta bancaria, usa la cuenta por defecto o la primera
                const defaultBankAccount = invoice.bank_accounts.find(acc => acc.is_default) || invoice.bank_accounts[0];
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
        
        // Si no hay una cuenta bancaria seleccionada, usa la cuenta por defecto o la primera
        if (!item.bankAccountId) {
            const defaultBankAccount = item.invoice.bank_accounts.find(acc => acc.is_default) || item.invoice.bank_accounts[0];
            return defaultBankAccount?.id || "";
        }
        
        return item.bankAccountId;
    };

    const clearSelectedInvoices = () => {
        setSelectedInvoices([]);
    };

    const generatePDF = () => {
        if (selectedInvoices.length === 0) return;
        generateSupplierInvoicePDF(selectedInvoices);
    };

    const availableCurrencies = ["UYU", "USD"];

    // Obtener las facturas separadas por moneda
    const getInvoicesByCurrency = () => {
        const invoicesByCurrency = {
            UYU: selectedInvoices.filter(item => item.currency === "UYU").map(item => item.invoice),
            USD: selectedInvoices.filter(item => item.currency === "USD").map(item => item.invoice)
        };
        return invoicesByCurrency;
    };

    return {
        listSupplier,
        selectedInvoices,
        toggleInvoiceSelection,
        isInvoiceSelected,
        getSelectedCurrency,
        getSelectedBankAccount,
        clearSelectedInvoices,
        generatePDF,
        availableCurrencies,
        getInvoicesByCurrency
    };
};