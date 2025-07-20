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
    status:         string;
    paye:           string;
    cuenta:         string;
    currency:       Currency;
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
