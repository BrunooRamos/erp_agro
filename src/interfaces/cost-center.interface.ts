export interface GetCostCenter {
    expenses:    Expenses;
    totals:      Totals;
    grand_total: number;
    period:      Period;
}

export interface Expenses {
    labors:    Labor[];
    rafs:      Raf[];
    seed_maps: SeedMap[];
}

export interface Labor {
    id:          string;
    date:        Date;
    labor_name:  string;
    labor_code:  string;
    total_area:  string;
    cusa_cost:   string;
    labor_cost:  number;
    fuel_liters: string;
    fuel_price:  string;
    fuel_cost:   number;
    total_cost:  number;
    lots:        Lot[];
}

export interface Lot {
    id:      string;
    name:    string;
    area:    string;
    sublot?: Sublot;
}


export interface Sublot {
    id:   string;
    name: string;
}

export interface Raf {
    id:            string;
    date:          Date;
    type:          string;
    sub_type:      string;
    description:   null;
    crop_code:     string;
    cusa_code:     string;
    laboreo:       string;
    total_area:    string;
    cusa_cost:     string;
    labor_cost:    number;
    fuel_liters:   string;
    fuel_price:    string;
    fuel_cost_usd: number;
    total_cost:    number;
    lots:          Lot[];
    products:      Product[];
}

export interface Product {
    product_name: string;
    quantity:     string;
    unit:         null | string;
    total_price:  string;
}

export interface SeedMap {
    id:                string;
    date:              Date;
    crop_code:         string;
    labor:             string;
    first_equipment:   Equipment;
    second_equipment:  Equipment;
    grooves:           string;
    total_area:        string;
    cusa_cost:         string;
    labor_cost:        number;
    fuel_liters:       string;
    fuel_liters_total: number;
    fuel_cost:         number;
    total_cost:        number;
    lots:              Lot[];
    products:          Product[];
}

export interface Equipment {
    code: null | string;
    name: null | string;
}

export interface Period {
    start_date: Date;
    end_date:   Date;
}

export interface Totals {
    labors:    number;
    rafs:      number;
    seed_maps: number;
}
