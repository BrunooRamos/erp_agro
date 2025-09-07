import { dolibarrApi } from "../../api";
import { AccountStatementFilters, InvoiceElement, SupplierAccountStatement, SupplierInvoice, Thirdparty, ThirdpartyFilters } from "../../interfaces";
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

export const generateSupplierInvoicePDF = (
    selectedInvoices: SelectedInvoice[],
    orderNumber: string
): void => {
    const doc = new jsPDF() as JsPDFWithAutoTable;

    // Encabezado estilo "resumen por proveedor"
    doc.setFontSize(20);
    doc.text('ORDEN DE PAGO', 14, 20);

    doc.setFontSize(14);
    const pageWidth = doc.internal.pageSize.width;
    doc.text(`N° ${orderNumber}`, pageWidth - 14, 20, { align: 'right' });

    doc.setFontSize(12);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text('Forma de Pago: BANCO', pageWidth - 14, 30, { align: 'right' });

    // Agrupar por proveedor y calcular totales por moneda, separando Banco vs Efectivo
    type SupplierRow = {
        supplierName: string;
        supplierCode?: string;
        totalUYU: number;
        totalUSD: number;
        bankAccount?: InvoiceElement["bank_accounts"][number] | null;
    };

    const supplierBankMap = new Map<string, SupplierRow>();
    const supplierCashMap = new Map<string, SupplierRow>();

    const resolvePaymentCurrencyCode = (currency: string): 'USD' | 'UYU' => {
        return currency.includes('USD') ? 'USD' : 'UYU';
    };

    selectedInvoices.forEach(item => {
        const supplierId = item.invoice.supplier.id;
        const supplierName = item.invoice.supplier.name;
        const paymentCurrency = resolvePaymentCurrencyCode(item.currency);
        const amount = item.invoice.invoice.pending_amount ||
            (item.invoice.invoice.currency.code === paymentCurrency
                ? item.invoice.invoice.currency.total_ttc
                : item.invoice.invoice.total_ttc);

        const isCash = item.currency === 'EFECTIVO_UYU' || item.currency === 'EFECTIVO_USD';
        const targetMap = isCash ? supplierCashMap : supplierBankMap;

        if (!targetMap.has(supplierId)) {
            targetMap.set(supplierId, {
                supplierName,
                supplierCode: undefined,
                totalUYU: 0,
                totalUSD: 0,
                bankAccount: null,
            });
        }

        const row = targetMap.get(supplierId)!;
        if (paymentCurrency === 'USD') {
            row.totalUSD += amount;
        } else {
            row.totalUYU += amount;
        }

        if (!isCash && !row.bankAccount) {
            const validBankAccounts = getValidBankAccounts(item.invoice);
            if (validBankAccounts.length > 0) {
                const selected = item.bankAccountId
                    ? validBankAccounts.find(acc => acc.id === item.bankAccountId)
                    : validBankAccounts.find(acc => acc.is_default) || validBankAccounts[0];
                row.bankAccount = selected || null;
            }
        }
    });

    // Totales generales por tipo de pago
    const grandTotalBankUYU = Array.from(supplierBankMap.values()).reduce((s, r) => s + r.totalUYU, 0);
    const grandTotalBankUSD = Array.from(supplierBankMap.values()).reduce((s, r) => s + r.totalUSD, 0);
    const grandTotalCashUYU = Array.from(supplierCashMap.values()).reduce((s, r) => s + r.totalUYU, 0);
    const grandTotalCashUSD = Array.from(supplierCashMap.values()).reduce((s, r) => s + r.totalUSD, 0);

    // Dos tablas separadas por moneda
    let currentY = 45;

    // Tabla para pagos en Pesos (UYU) - Banco
    const uyRows = Array.from(supplierBankMap.values())
        .filter(r => r.totalUYU > 0)
        .sort((a, b) => a.supplierName.localeCompare(b.supplierName))
        .map(r => {
            const bank = r.bankAccount;
            return [
                r.supplierName,
                r.supplierCode || '-',
                `$ ${r.totalUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                r.totalUSD > 0 ? `U$S ${r.totalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
                bank?.bank_name || '-',
                bank?.label || '-',
                'UYU',
                bank?.account_number || bank?.iban || '-',
                bank?.owner || '-',
            ];
        });

    if (uyRows.length > 0) {
        doc.setFontSize(13);
        doc.text('Pagos en Pesos (UYU)', 14, currentY);
        autoTable(doc, {
            head: [[
                'Nombre',
                'Cod.',
                'UYU',
                'USD',
                'Banco',
                'Tipo',
                'Mon.',
                'Nro.',
                'Titular'
            ]],
            body: uyRows,
            startY: currentY + 5,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            foot: [[
                'Total UYU',
                '',
                `$ ${grandTotalBankUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                '',
                '', '', '', '', ''
            ]],
            footStyles: { fillColor: [46, 204, 113] }
        });
        currentY = (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 10;
    }

    // Tabla para pagos en Dólares (USD) - Banco
    const usdRows = Array.from(supplierBankMap.values())
        .filter(r => r.totalUSD > 0)
        .sort((a, b) => a.supplierName.localeCompare(b.supplierName))
        .map(r => {
            const bank = r.bankAccount;
            return [
                r.supplierName,
                r.supplierCode || '-',
                r.totalUYU > 0 ? `$ ${r.totalUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
                `U$S ${r.totalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                bank?.bank_name || '-',
                bank?.label || '-',
                'USD',
                bank?.account_number || bank?.iban || '-',
                bank?.owner || '-',
            ];
        });

    if (usdRows.length > 0) {
        // Si estamos muy abajo en la página, autoTable puede agregar página nueva automáticamente
        doc.setFontSize(13);
        doc.text('Pagos en Dólares (USD)', 14, currentY);
        autoTable(doc, {
            head: [[
                'Nombre',
                'Cod.',
                'UYU',
                'USD',
                'Banco',
                'Tipo',
                'Mon.',
                'Nro.',
                'Titular'
            ]],
            body: usdRows,
            startY: currentY + 5,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            foot: [[
                'Total USD',
                '',
                '',
                `U$S ${grandTotalBankUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                '', '', '', '', ''
            ]],
            footStyles: { fillColor: [46, 204, 113] }
        });
    }

    // Tabla para pagos en Efectivo UYU
    const cashUyRows = Array.from(supplierCashMap.values())
        .filter(r => r.totalUYU > 0)
        .sort((a, b) => a.supplierName.localeCompare(b.supplierName))
        .map(r => {
            return [
                r.supplierName,
                r.supplierCode || '-',
                `$ ${r.totalUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                r.totalUSD > 0 ? `U$S ${r.totalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
                '-',
                'EFECTIVO',
                'UYU',
                '-',
                '-',
            ];
        });

    if (cashUyRows.length > 0) {
        currentY = (doc as JsPDFWithAutoTable).lastAutoTable ? (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 10 : currentY;
        doc.setFontSize(13);
        doc.text('Pagos en Efectivo (UYU)', 14, currentY);
        autoTable(doc, {
            head: [[
                'Nombre',
                'Cod.',
                'UYU',
                'USD',
                'Banco',
                'Tipo',
                'Mon.',
                'Nro.',
                'Titular'
            ]],
            body: cashUyRows,
            startY: currentY + 5,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            foot: [[
                'Total UYU',
                '',
                `$ ${grandTotalCashUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                '',
                '', '', '', '', ''
            ]],
            footStyles: { fillColor: [46, 204, 113] }
        });
    }

    // Tabla para pagos en Efectivo USD
    const cashUsdRows = Array.from(supplierCashMap.values())
        .filter(r => r.totalUSD > 0)
        .sort((a, b) => a.supplierName.localeCompare(b.supplierName))
        .map(r => {
            return [
                r.supplierName,
                r.supplierCode || '-',
                r.totalUYU > 0 ? `$ ${r.totalUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
                `U$S ${r.totalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                '-',
                'EFECTIVO',
                'USD',
                '-',
                '-',
            ];
        });

    if (cashUsdRows.length > 0) {
        currentY = (doc as JsPDFWithAutoTable).lastAutoTable ? (doc as JsPDFWithAutoTable).lastAutoTable.finalY + 10 : currentY;
        doc.setFontSize(13);
        doc.text('Pagos en Efectivo (USD)', 14, currentY);
        autoTable(doc, {
            head: [[
                'Nombre',
                'Cod.',
                'UYU',
                'USD',
                'Banco',
                'Tipo',
                'Mon.',
                'Nro.',
                'Titular'
            ]],
            body: cashUsdRows,
            startY: currentY + 5,
            theme: 'striped',
            headStyles: { fillColor: [41, 128, 185] },
            foot: [[
                'Total USD',
                '',
                '',
                `U$S ${grandTotalCashUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                '', '', '', '', ''
            ]],
            footStyles: { fillColor: [46, 204, 113] }
        });
    }

    // Guardar
    doc.save(`orden_pago_resumen_${new Date().toISOString().slice(0, 10)}.pdf`);
};

export const getSupplierAccountStatement = async (filters: AccountStatementFilters): Promise<SupplierAccountStatement> => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const response = await dolibarrApi.get(`/vicentina/supplier-account-statement?${params.toString()}`);
  return response.data as SupplierAccountStatement;
};

export const getThirdparties = async (filters: ThirdpartyFilters = {}): Promise<Thirdparty[]> => {
  const params = new URLSearchParams();
  
  // Valores por defecto
  const defaultFilters = {
    sortfield: 't.nom',
    sortorder: 'ASC' as const,
    limit: 100,
    ...filters
  };
  
  Object.entries(defaultFilters).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  });
  
  const response = await dolibarrApi.get(`/thirdparties?limit=1200`);
  console.log(response.data);
  return response.data as Thirdparty[];
};