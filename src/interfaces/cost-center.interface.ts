export interface RafRegister {
    raf:      Raf;
    lots:     Lot[];
    products: Product[];
}

export interface Lot {
    rowid:          string;
    name:           string;
    area_utilizada: string;
    description:    string;
}

export interface Product {
    product_name:    string;
    product_ref:     string;
    rowid:           string;
    register_type:   string;
    fk_register:     string;
    fk_product:      string;
    quantity:        string;
    warehouse_id:    string;
    type:            string;
    stock_used:      string;
    total_price:     string;
    total_price_usd: string;
    date_creation:   Date;
    warehouse_name:  string;
    medida:          string;
}

export interface Raf {
    rowid:       string;
    crop_code:   string;
    date:        Date;
    type:        string;
    sub_type:    string;
    total_area:  string;
    description: null;
}
