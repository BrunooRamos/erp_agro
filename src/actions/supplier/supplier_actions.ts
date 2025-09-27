import { dolibarrApi } from "../../api";
import { AccountStatementFilters, InvoiceElement, SupplierAccountStatement, SupplierInvoice, Thirdparty, ThirdpartyFilters, AvailableAccountsResponse, SupplierDueReport, SupplierDueReportFilters } from "../../interfaces";
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

// ---- Supplier Due Report (Vencimientos Estudio) ----

export const getAvailableAccounts = async (): Promise<AvailableAccountsResponse> => {
  const response = await dolibarrApi.get(`/vicentina/available-accounts`);
  return response.data as AvailableAccountsResponse;
};

export const getSupplierDueReport = async (filters: SupplierDueReportFilters): Promise<SupplierDueReport> => {
  // Map report filters with the new expected param names
  const params = new URLSearchParams();
  if (filters.account) params.append('account', filters.account);
  if (filters.date_from) params.append('date_from', filters.date_from);
  if (filters.date_to) params.append('date_to', filters.date_to);

  const response = await dolibarrApi.get(`/vicentina/supplier-account-statement?${params.toString()}`);
  const raw = response.data as unknown;

  // Transform the account statement movements into the due-report contract
  const formatMonth = (iso: string) => {
    const d = new Date(iso);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${mm}-${yyyy}`;
  };

  // Helper to normalize both legacy single-supplier and new aggregated responses into a unified stream of rows
  type AggregatedResponse = {
    currency: string;
    total_suppliers: number;
    grand_current_balance: number;
    grand_total_movements: number;
    suppliers: Array<{
      supplier: { id: number; name: string };
      currency: string;
      current_balance: number;
      total_movements: number;
      movements: AccountMovement[];
    }>;
    filters?: unknown;
  };

  const isAggregated = (v: any): v is AggregatedResponse => Array.isArray(v?.suppliers);
  const isLegacy = (v: any): v is SupplierAccountStatement => Array.isArray(v?.movements) && v?.supplier;

  const movements: { supplierId: number; supplierName: string; movement: AccountMovement }[] = [];
  if (isAggregated(raw)) {
    for (const s of raw.suppliers) {
      for (const m of (s.movements || [])) {
        movements.push({ supplierId: s.supplier.id, supplierName: s.supplier.name, movement: m });
      }
    }
  } else if (isLegacy(raw)) {
    for (const m of (raw.movements || [])) {
      movements.push({ supplierId: raw.supplier.id, supplierName: raw.supplier.name, movement: m });
    }
  } else {
    // Fallback: nothing usable
    return {
      total_count: 0,
      report_header: {
        account_label: `Cuenta ${filters.account || ''}`.trim(),
        date_from: filters.date_from,
        date_to: filters.date_to,
        generated_at: new Date().toISOString(),
      },
      invoices: [],
      subtotals: { by_supplier: [], by_month_due: [] },
      grand_total: { amount_uyu: 0, amount_usd: 0 },
    };
  }

  const invoices = movements.flatMap(({ supplierId, supplierName, movement: m }) => {
    const rows: SupplierDueReport["invoices"] = [] as unknown as SupplierDueReport["invoices"];
    const isUSD = m.currency === 'USD';
    const amount = (m.debit || 0) - (m.credit || 0);
    const dueDate = m.document_date; // no due date provided; approximate with document_date

    if (m.document_type === 'Factura') {
      rows.push({
        invoice: {
          id: String(m.document_id),
          ref: m.document_ref || '',
          ref_supplier: m.document_ref_supplier || '',
          date: m.document_date,
          due_date: dueDate,
          month_year_due: formatMonth(dueDate),
          type_document: 'Credito',
          printable_amounts: {
            amount_uyu: isUSD ? 0 : amount,
            amount_usd: isUSD ? amount : 0,
          },
        },
        supplier: { id: String(supplierId), name: supplierName },
        payments: [],
        credit_notes: [],
        bank_accounts: [],
      });
    } else if (m.document_type === 'Nota de Crédito') {
      // Represent as stand-alone credit note row (subtracts)
      rows.push({
        invoice: {
          id: `NC-${m.document_id}`,
          ref: m.document_ref || '',
          ref_supplier: m.document_ref_supplier || '',
          date: m.document_date,
          due_date: '',
          month_year_due: formatMonth(m.document_date),
          type_document: 'Nota de crédito',
          printable_amounts: {
            amount_uyu: isUSD ? 0 : amount, // amount is expected negative
            amount_usd: isUSD ? amount : 0,
          },
        },
        supplier: { id: String(supplierId), name: supplierName },
        payments: [],
        credit_notes: [],
        bank_accounts: [],
      });
    } else if (m.document_type === 'Recibo de Pago') {
      // Represent as a payment row (subtracts). Show OP columns and negative amount in the currency.
      const payAmount = (m.debit || 0) - (m.credit || 0); // typically negative
      rows.push({
        invoice: {
          id: `PAGO-${m.document_id}`,
          ref: '',
          ref_supplier: '',
          date: m.document_date,
          due_date: '',
          month_year_due: formatMonth(m.document_date),
          type_document: 'Pago',
          printable_amounts: {
            amount_uyu: isUSD ? 0 : payAmount,
            amount_usd: isUSD ? payAmount : 0,
          },
        },
        supplier: { id: String(supplierId), name: supplierName },
        payments: [{ payment_order_date: m.document_date, payment_order_ref: m.document_ref || null }],
        credit_notes: [],
        bank_accounts: [],
      });
    }

    return rows;
  });

  // Compute subtotals and grand total from transformed invoices
  const bySupplierMap = new Map<string, { supplier_name: string; amount_uyu: number; amount_usd: number }>();
  const byMonthMap = new Map<string, { amount_uyu: number; amount_usd: number }>();
  let totalUYU = 0;
  let totalUSD = 0;

  for (const row of invoices) {
    const sid = row.supplier.id;
    const sname = row.supplier.name;
    const uy = row.invoice.printable_amounts?.amount_uyu || 0;
    const us = row.invoice.printable_amounts?.amount_usd || 0;
    totalUYU += uy; totalUSD += us;

    if (!bySupplierMap.has(sid)) bySupplierMap.set(sid, { supplier_name: sname, amount_uyu: 0, amount_usd: 0 });
    const sAgg = bySupplierMap.get(sid)!;
    sAgg.amount_uyu += uy; sAgg.amount_usd += us;

    const month = row.invoice.month_year_due;
    if (!byMonthMap.has(month)) byMonthMap.set(month, { amount_uyu: 0, amount_usd: 0 });
    const mAgg = byMonthMap.get(month)!;
    mAgg.amount_uyu += uy; mAgg.amount_usd += us;
  }

  const transformed: SupplierDueReport = {
    total_count: invoices.length,
    report_header: {
      account_label: `Cuenta ${filters.account || ''}`.trim(),
      date_from: filters.date_from,
      date_to: filters.date_to,
      generated_at: new Date().toISOString(),
    },
    invoices,
    subtotals: {
      by_supplier: Array.from(bySupplierMap.entries()).map(([supplier_id, v]) => ({
        supplier_id,
        supplier_name: v.supplier_name,
        amount_uyu: v.amount_uyu,
        amount_usd: v.amount_usd,
      })),
      by_month_due: Array.from(byMonthMap.entries()).map(([month_year_due, v]) => ({
        month_year_due,
        amount_uyu: v.amount_uyu,
        amount_usd: v.amount_usd,
      })),
    },
    grand_total: { amount_uyu: totalUYU, amount_usd: totalUSD },
  };

  return transformed;
};

export const generateSupplierDueReportPDF = (report: SupplierDueReport): void => {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' }) as unknown as JsPDFWithAutoTable;

  const margin = 36; // ~12mm
  const pageWidth = (doc as unknown as jsPDF).internal.pageSize.getWidth();
  const pageHeight = (doc as unknown as jsPDF).internal.pageSize.getHeight();

  const formatDate = (iso: string) => new Date(iso).toLocaleDateString('es-UY');
  const formatMoney = (n?: number | null) => typeof n === 'number' && n !== 0
    ? n.toLocaleString('es-UY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : '';

  const header = () => {
    (doc as unknown as jsPDF).setFontSize(16);
    (doc as unknown as jsPDF).setFont('helvetica', 'bold');
    (doc as unknown as jsPDF).text('VENCIMIENTOS (ESTUDIO)', margin, margin);

    (doc as unknown as jsPDF).setFontSize(11);
    (doc as unknown as jsPDF).setFont('helvetica', 'normal');
    (doc as unknown as jsPDF).text(`Cuenta: ${report.report_header.account_label}`, margin, margin + 18);
    (doc as unknown as jsPDF).text(`Período: ${formatDate(report.report_header.date_from)} – ${formatDate(report.report_header.date_to)}`, margin, margin + 34);
    (doc as unknown as jsPDF).text(`Generado: ${new Date(report.report_header.generated_at).toLocaleString('es-UY')}`, margin, margin + 50);
  };

  // Build rows grouped by month and supplier as flat rows, using the API-calculated totals
  // Columns: M-A Vto., Proveedor, Fecha Vto., Tipo Doc., Fecha Doc., N° Doc., Fecha OP, N° OP, $, U$S
  const head = [[
    'M-A Vto.', 'Proveedor', 'Fecha Vto.', 'Tipo Doc.', 'Fecha Doc.', 'N° Doc.', 'Fecha Orden de Pago', 'N° Orden de Pago', '$', 'U$S'
  ]];

  const body: (string)[][] = [];

  // Sort invoices: group by month_year_due then supplier, inside sort by due_date asc
  const invoices = [...report.invoices].sort((a, b) => {
    if (a.invoice.month_year_due !== b.invoice.month_year_due) {
      return a.invoice.month_year_due.localeCompare(b.invoice.month_year_due);
    }
    if (a.supplier.name !== b.supplier.name) {
      return a.supplier.name.localeCompare(b.supplier.name);
    }
    return a.invoice.due_date.localeCompare(b.invoice.due_date);
  });

  // Helper to push subtotal rows
  const pushSupplierSubtotal = (supplierId: string) => {
    const s = report.subtotals.by_supplier.find(x => x.supplier_id === supplierId);
    if (!s) return;
    body.push([
      '', `Subtotal ${s.supplier_name}`, '', '', '', '', '', '', formatMoney(s.amount_uyu), formatMoney(s.amount_usd)
    ]);
  };

  const pushMonthSubtotal = (month: string) => {
    const m = report.subtotals.by_month_due.find(x => x.month_year_due === month);
    if (!m) return;
    body.push([
      '', `Subtotal ${month}`, '', '', '', '', '', '', formatMoney(m.amount_uyu), formatMoney(m.amount_usd)
    ]);
  };

  let currentMonth: string | null = null;
  let currentSupplierId: string | null = null;

  invoices.forEach((row, idx) => {
    if (row.invoice.month_year_due !== currentMonth) {
      if (currentSupplierId) {
        pushSupplierSubtotal(currentSupplierId);
        currentSupplierId = null;
      }
      if (currentMonth) {
        pushMonthSubtotal(currentMonth);
      }
      currentMonth = row.invoice.month_year_due;
      // Add a visual month header as an empty separator (optional)
    }
    if (row.supplier.id !== currentSupplierId) {
      if (currentSupplierId) {
        pushSupplierSubtotal(currentSupplierId);
      }
      currentSupplierId = row.supplier.id;
    }

    const payment = row.payments && row.payments[0] ? row.payments[0] : undefined;
    body.push([
      row.invoice.month_year_due,
      row.supplier.name,
      formatDate(row.invoice.due_date),
      row.invoice.type_document,
      formatDate(row.invoice.date),
      row.invoice.ref,
      payment?.payment_order_date ? formatDate(payment.payment_order_date) : '',
      payment?.payment_order_ref || '',
      formatMoney(row.invoice.printable_amounts?.amount_uyu ?? null),
      formatMoney(row.invoice.printable_amounts?.amount_usd ?? null),
    ]);

    const next = invoices[idx + 1];
    if (!next || next.supplier.id !== currentSupplierId) {
      if (currentSupplierId) {
        pushSupplierSubtotal(currentSupplierId);
        currentSupplierId = null;
      }
    }
    if (!next || next.invoice.month_year_due !== currentMonth) {
      if (currentMonth) {
        pushMonthSubtotal(currentMonth);
      }
      currentMonth = next ? next.invoice.month_year_due : null;
    }
  });

  // Grand total
  body.push([
    '', 'TOTAL GENERAL', '', '', '', '', '', '', formatMoney(report.grand_total.amount_uyu), formatMoney(report.grand_total.amount_usd)
  ]);

  const startY = margin + 70;
  autoTable(doc as unknown as jsPDF, {
    head,
    body,
    startY,
    margin: { top: margin + 60, bottom: margin + 20, left: margin, right: margin },
    theme: 'striped',
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' },
    tableWidth: 770, // content width with margins (A4 landscape ~842 - 72)
    columnStyles: {
      0: { cellWidth: 50 },  // M-A Vto.
      1: { cellWidth: 150 }, // Proveedor
      2: { cellWidth: 60 },  // Fecha Vto.
      3: { cellWidth: 60 },  // Tipo Doc.
      4: { cellWidth: 60 },  // Fecha Doc.
      5: { cellWidth: 80 },  // N° Doc.
      6: { cellWidth: 80 },  // Fecha OP
      7: { cellWidth: 90 },  // N° OP
      8: { halign: 'right', cellWidth: 70 }, // $
      9: { halign: 'right', cellWidth: 70 }, // U$S
    },
    rowPageBreak: 'avoid',
    didDrawPage: () => {
      // Footer with page X of Y
      const str = `Página ${(doc as unknown as jsPDF).getCurrentPageInfo().pageNumber} de ${(doc as unknown as jsPDF).getNumberOfPages()}`;
      (doc as unknown as jsPDF).setFontSize(10);
      (doc as unknown as jsPDF).text(str, pageWidth - margin, pageHeight - margin / 2, { align: 'right' });
      // Redraw header on each page
      header();
    },
    willDrawCell: (data) => {
      // Bold style for subtotal and total rows
      const raw = (data.row && (data.row.raw as unknown)) as unknown as string[] | undefined;
      const v = Array.isArray(raw) ? raw[1] : undefined;
      if (typeof v === 'string') {
        if (v.startsWith('Subtotal') || v === 'TOTAL GENERAL') {
          data.cell.styles.fontStyle = 'bold';
          if (v === 'TOTAL GENERAL') {
            data.cell.styles.fillColor = [245, 245, 245];
          }
        }
      }
      // Prevent splitting subtotal/total rows across pages
      // jsPDF-Autotable doesn't expose pageBreak on row type in TS; we rely on rowPageBreak: 'avoid'
    },
  });

  (doc as unknown as jsPDF).save(`vencimientos_estudio_${new Date().toISOString().slice(0,10)}.pdf`);
};