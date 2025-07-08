import { dolibarrApi } from "../../api";
import { InvoiceElement, SupplierInvoice } from "../../interfaces";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const getSupplier = async () : Promise<SupplierInvoice> => {
    const response = await dolibarrApi.get('/vicentina/pending-supplier-invoices');
    return response.data as SupplierInvoice;
};

interface SelectedInvoice {
  invoice: InvoiceElement;
  currency: string;
  bankAccountId?: string;
}

interface JsPDFWithAutoTable extends jsPDF {
    lastAutoTable: {
        finalY: number;
    };
}

export const generateSupplierInvoicePDF = (
    selectedInvoices: SelectedInvoice[]
): void => {
    const doc = new jsPDF() as JsPDFWithAutoTable;
    
    // Add title
    doc.setFontSize(20);
    doc.text('Facturas de Proveedores - ' + new Date().toLocaleDateString(), 14, 20);
    
    // Separar las facturas por moneda
    const uyuInvoices = selectedInvoices.filter(item => item.currency === "UYU");
    const usdInvoices = selectedInvoices.filter(item => item.currency === "USD");
    
    // Ordenar facturas por nombre de proveedor
    const sortBySupplierName = (a: SelectedInvoice, b: SelectedInvoice) => {
        return a.invoice.supplier.name.localeCompare(b.invoice.supplier.name);
    };
    
    uyuInvoices.sort(sortBySupplierName);
    usdInvoices.sort(sortBySupplierName);
    
    let currentY = 30;
    
    // Facturas en UYU
    if (uyuInvoices.length > 0) {
        doc.setFontSize(16);
        doc.text('Facturas en Pesos (UYU)', 14, currentY);
        currentY += 10;
        
        const tableColumns = [
            "Proveedor",
            "Referencia", 
            "Fecha Vencimiento", 
            "Monto", 
            "Banco",
            "Cuenta",
            "Titular"
        ];
        
        const tableRows = uyuInvoices.map(item => {
            const amount = item.invoice.invoice.currency.code === "UYU" 
                ? item.invoice.invoice.currency.total_ttc
                : item.invoice.invoice.total_ttc;
                
            const selectedBankAccount = item.bankAccountId 
                ? item.invoice.bank_accounts.find(acc => acc.id === item.bankAccountId)
                : item.invoice.bank_accounts.find(acc => acc.is_default) || item.invoice.bank_accounts[0];
                
            return [
                item.invoice.supplier.name,
                item.invoice.invoice.ref,
                new Date(item.invoice.invoice.due_date).toLocaleDateString(),
                `${amount.toFixed(2)} UYU`,
                selectedBankAccount?.bank_name || "-",
                selectedBankAccount?.account_number || selectedBankAccount?.iban || "-",
                selectedBankAccount?.owner || "-"
            ];
        });
        
        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: currentY,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });
        
        // Actualizar posición Y para la siguiente tabla
        currentY = doc.lastAutoTable.finalY + 15;
    }
    
    // Facturas en USD
    if (usdInvoices.length > 0) {
        doc.setFontSize(16);
        doc.text('Facturas en Dólares (USD)', 14, currentY);
        currentY += 10;
        
        const tableColumns = [
            "Proveedor",
            "Referencia", 
            "Fecha Vencimiento", 
            "Monto", 
            "Banco",
            "Cuenta",
            "Titular"
        ];
        
        const tableRows = usdInvoices.map(item => {
            const amount = item.invoice.invoice.currency.code === "USD" 
                ? item.invoice.invoice.currency.total_ttc
                : item.invoice.invoice.total_ttc;
                
            const selectedBankAccount = item.bankAccountId 
                ? item.invoice.bank_accounts.find(acc => acc.id === item.bankAccountId)
                : item.invoice.bank_accounts.find(acc => acc.is_default) || item.invoice.bank_accounts[0];
                
            return [
                item.invoice.supplier.name,
                item.invoice.invoice.ref,
                new Date(item.invoice.invoice.due_date).toLocaleDateString(),
                `${amount.toFixed(2)} USD`,
                selectedBankAccount?.bank_name || "-",
                selectedBankAccount?.account_number || selectedBankAccount?.iban || "-",
                selectedBankAccount?.owner || "-"
            ];
        });
        
        autoTable(doc, {
            head: [tableColumns],
            body: tableRows,
            startY: currentY,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] }
        });
    }
    
    // Generate PDF file
    doc.save(`facturas_proveedores_${new Date().toISOString().slice(0, 10)}.pdf`);
};