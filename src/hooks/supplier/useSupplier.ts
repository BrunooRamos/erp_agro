import { useState } from "react";
import { generateSupplierInvoicePDF, getSupplier } from "../../actions";
import { useBaseQuery } from "../config/useBaseQuery";
import { InvoiceElement } from "../../interfaces";

interface SelectedInvoice {
  invoice: InvoiceElement;
  currency: string;
}

export const useSupplier = () => {
    const [selectedInvoices, setSelectedInvoices] = useState<SelectedInvoice[]>([]);

    const listSupplier = useBaseQuery(
        ['supplier'],
        getSupplier
    );

    const toggleInvoiceSelection = (invoice: InvoiceElement, currency: string) => {
        setSelectedInvoices(prev => {
            const existingIndex = prev.findIndex(item => item.invoice.invoice.id === invoice.invoice.id);
            if (existingIndex >= 0) {
                // Si ya existe pero cambia la moneda, actualiza la moneda
                if (prev[existingIndex].currency !== currency) {
                    const newItems = [...prev];
                    newItems[existingIndex] = { invoice, currency };
                    return newItems;
                }
                // Si ya existe con la misma moneda, lo elimina (toggle)
                return prev.filter(item => item.invoice.invoice.id !== invoice.invoice.id);
            } else {
                // Si no existe, lo agrega
                return [...prev, { invoice, currency }];
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
        clearSelectedInvoices,
        generatePDF,
        availableCurrencies,
        getInvoicesByCurrency
    };
};