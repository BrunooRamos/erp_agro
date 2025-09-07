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
  start_date?: string;
  end_date?: string;
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
}
