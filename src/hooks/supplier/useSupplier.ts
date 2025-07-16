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

    // Función helper para verificar si una cuenta bancaria es válida
    const hasValidBankAccount = (invoice: InvoiceElement) => {
        if (!invoice.bank_accounts || invoice.bank_accounts.length === 0) {
            return false;
        }
        
        // Verificar si al menos una cuenta tiene account_number o iban
        return invoice.bank_accounts.some(account => 
            (account.account_number && account.account_number.trim() !== '') || 
            (account.iban && account.iban.trim() !== '')
        );
    };

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