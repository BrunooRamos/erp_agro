export interface SupplierInvoice {
    total_count: number;
    invoices:    InvoiceElement[];
}


export interface RawDatum {
    invoice_id:  string;
    ref:         string;
    status:      string;
    paye:        string;
    supplier_id: string;
}

export interface InvoiceElement {
    invoice:       InvoiceInvoice;
    supplier:      Supplier;
    bank_accounts: BankAccount[];
    credit_notes?: CreditNote[];
}

export interface BankAccount {
    id:             string;
    label:          string;
    bank_name:      string;
    account_number: string;
    iban:           string;
    bic:            string;
    domiciliation:  string;
    owner:          string;
    is_default:     boolean;
}

export interface InvoiceInvoice {
    id:             string;
    ref:            string;
    ref_supplier:   string;
    date:           Date;
    due_date:       Date;
    days_remaining: number;
    total_ht:       number;
    total_tva:      number;
    total_ttc:      number;
    pending_amount?: number;
    total_paid?:    number;
    total_credits?: number;
    original_amount?: number;
    status:         string;
    paye:           string;
    cuenta:         string;
    currency:       Currency;
    in_payment_order?: number; // 0 = disponible, 1 = en orden de pago pendiente
}

export interface CreditNote {
    id: string;
    ref: string;
    date: string | Date;
    amount: number;
    currency: 'USD' | 'UYU';
    status: string;
}

export interface Supplier {
    id:         string;
    name:       string;
    address:    string;
    zip:        string;
    town:       string;
    phone:      string;
    email:      string;
    vat_number: string;
}


export interface Currency {
    code:      string;
    rate:      number;
    total_ht:  number;
    total_tva: number;
    total_ttc: number;
}

export interface SupplierAccountStatement {
  supplier: {
    id: number;
    name: string;
  };
  currency: string;
  current_balance: number;
  total_movements: number;
  movements: AccountMovement[];
  filters: AccountStatementFilters;
}

export interface AccountMovement {
  document_type: string;
  document_id: number;
  document_ref: string;
  document_ref_supplier: string;
  document_date: string;
  debit: number;
  credit: number;
  balance: number;
  currency: string;
  cuenta: string;
}

export interface AccountStatementFilters {
  supplier_id?: number;
  currency?: string;
  entity?: number;
  cuenta?: string;
  document_types?: string[];
  date_from?: string;
  date_to?: string;
  only_pending?: boolean;
}

// Interfaces para terceros (thirdparties) de Dolibarr
export interface Thirdparty {
  id: string;
  name: string;
  name_alias?: string;
  client: string;  // "0" = no cliente, "1" = cliente
  fournisseur: string;  // "0" = no proveedor, "1" = proveedor
  code_fournisseur?: string;
  code_client?: string;
  status: string;
  address?: string;
  zip?: string;
  town?: string;
  phone?: string;
  email?: string;
  vat_number?: string;
}

export interface ThirdpartyFilters {
  mode?: number;  // 1=clientes, 2=proveedores, 3=prospectos
  sortfield?: string;
  sortorder?: 'ASC' | 'DESC';
  limit?: number;
  sqlfilters?: string;
}

export interface SupplierTotal {
  supplierId: string;
  supplierName: string;
  invoicesCount: number;
  totalUSD: number;
  totalUYU: number;
  invoiceRefs: string[];
}

// ---- Supplier Due Report (Vencimientos Estudio) ----

export interface AvailableAccountsResponse {
  total_count: number;
  accounts: AvailableAccount[];
}

export interface AvailableAccount {
  cuenta: string;
  label: string;
}

export interface SupplierDueReportFilters {
  account: string; // value of "cuenta"
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
  supplier_id?: string;
  currency?: 'UYU' | 'USD' | '';
  type_document?: string; // client-side filter by document type
}

export interface SupplierDueReport {
  total_count: number;
  report_header: SupplierDueReportHeader;
  invoices: SupplierDueReportInvoiceEntry[];
  subtotals: {
    by_supplier: SupplierDueReportSupplierSubtotal[];
    by_month_due: SupplierDueReportMonthSubtotal[];
  };
  grand_total: SupplierDueReportTotal;
}

export interface SupplierDueReportHeader {
  account_label: string;
  date_from: string; // YYYY-MM-DD
  date_to: string; // YYYY-MM-DD
  generated_at: string; // ISO string
}

export interface SupplierDueReportInvoiceEntry {
  invoice: SupplierDueReportInvoice;
  supplier: { id: string; name: string };
  payments: SupplierDueReportPayment[];
  credit_notes: SupplierDueReportCreditNote[];
  bank_accounts: unknown[];
}

export interface SupplierDueReportInvoice {
  id: string;
  ref: string; // N° Doc.
  ref_supplier?: string | null; // Optional/tooltip
  date: string; // YYYY-MM-DD
  due_date: string; // YYYY-MM-DD
  month_year_due: string; // MM-YYYY
  type_document: 'Credito' | 'Contado' | 'Pago' | 'Nota de crédito';
  printable_amounts: {
    amount_uyu: number; // Columna "$"
    amount_usd: number; // Columna "U$S"
  };
}

export interface SupplierDueReportPayment {
  payment_order_ref: string | null; // N° Orden de Pago
  payment_order_date: string | null; // YYYY-MM-DD
}

export interface SupplierDueReportCreditNote {
  id: string;
  ref: string;
  amount: number;
  currency: 'UYU' | 'USD';
}

export interface SupplierDueReportSupplierSubtotal {
  supplier_id: string;
  supplier_name: string;
  amount_uyu: number;
  amount_usd: number;
}

export interface SupplierDueReportMonthSubtotal {
  month_year_due: string; // MM-YYYY
  amount_uyu: number;
  amount_usd: number;
}

export interface SupplierDueReportTotal {
  amount_uyu: number;
  amount_usd: number;
}
