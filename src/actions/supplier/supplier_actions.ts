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

    // Agrupar por proveedor y calcular totales por moneda
    type SupplierRow = {
        supplierName: string;
        supplierCode?: string;
        totalUYU: number;
        totalUSD: number;
        bankAccount?: InvoiceElement["bank_accounts"][number] | null;
    };

    const supplierMap = new Map<string, SupplierRow>();

    selectedInvoices.forEach(item => {
        const supplierId = item.invoice.supplier.id;
        const supplierName = item.invoice.supplier.name;
        const amount = item.invoice.invoice.pending_amount ||
            (item.invoice.invoice.currency.code === item.currency
                ? item.invoice.invoice.currency.total_ttc
                : item.invoice.invoice.total_ttc);

        if (!supplierMap.has(supplierId)) {
            supplierMap.set(supplierId, {
                supplierName,
                supplierCode: undefined, // No disponible en la interfaz actual de Invoice.supplier
                totalUYU: 0,
                totalUSD: 0,
                bankAccount: null,
            });
        }

        const row = supplierMap.get(supplierId)!;
        if (item.currency === 'USD') {
            row.totalUSD += amount;
        } else {
            row.totalUYU += amount;
        }

        // Elegir una cuenta bancaria representativa para el proveedor
        if (!row.bankAccount) {
            const validBankAccounts = getValidBankAccounts(item.invoice);
            if (validBankAccounts.length > 0) {
                const selected = item.bankAccountId
                    ? validBankAccounts.find(acc => acc.id === item.bankAccountId)
                    : validBankAccounts.find(acc => acc.is_default) || validBankAccounts[0];
                row.bankAccount = selected || null;
            }
        }
    });

    // Totales generales
    const grandTotalUYU = Array.from(supplierMap.values()).reduce((s, r) => s + r.totalUYU, 0);
    const grandTotalUSD = Array.from(supplierMap.values()).reduce((s, r) => s + r.totalUSD, 0);

    // Tabla principal similar a Excel
    const head = [[
        'Nombre',
        'Cod.',
        'UYU',
        'USD',
        'Banco',
        'Tipo',
        'Mon.',
        'Nro.',
        'Titular'
    ]];

    const body = Array.from(supplierMap.values())
        .sort((a, b) => a.supplierName.localeCompare(b.supplierName))
        .map(r => {
            const bank = r.bankAccount;
            const inferredBankCurrency = r.totalUSD > 0 && r.totalUYU === 0
                ? 'USD'
                : r.totalUYU > 0 && r.totalUSD === 0
                    ? 'UYU'
                    : '-';

            return [
                r.supplierName,
                r.supplierCode || '-',
                r.totalUYU > 0 ? `$ ${r.totalUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
                r.totalUSD > 0 ? `$ ${r.totalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-',
                bank?.bank_name || '-',
                bank?.label || '-',
                inferredBankCurrency,
                bank?.account_number || bank?.iban || '-',
                bank?.owner || '-',
            ];
        });

    autoTable(doc, {
        head,
        body,
        startY: 45,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185] },
        foot: [[
            'Total general',
            '',
            `$ ${grandTotalUYU.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            `$ ${grandTotalUSD.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
            '', '', '', '', ''
        ]],
        footStyles: { fillColor: [46, 204, 113] }
    });

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