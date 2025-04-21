export interface GetCostCenter {
    expenses:    ExpensesCostCenter;
    totals:      TotalsCostCenter;
    grand_total: number;
    period:      PeriodCostCenter;
}

export interface ExpensesCostCenter {
    labors:    LaborCostCenter[];
    rafs:      RafCostCenter[];
    seed_maps: SeedMapCostCenter[];
    irrigations: IrrigationCostCenter[];
    fertirriego: FertirriegoCostCenter[];
    logistic_costs: LogisticCostsCenter[];
    wash_processes: WashProcessCostCenter[];
    tong_processes: TongProcessCostCenter[];
    maintenance_costs: MaintenanceCostCenter[];
    other_expenses: OtherExpenseCostCenter[];
}

export interface OtherExpenseCostCenter {
    id:          number;
    date:        Date;
    name:        string;
    description: string;
    amounts:     { [key: string]: number };
    crop_code:   string;
    user:        UserOtherExpense;
    dates:       DatesOtherExpense;
    total_cost:  number;
    task:        string;
}

export interface DatesOtherExpense {
    created:  Date;
    modified: Date;
}

export interface UserOtherExpense {
    created_by:  string;
    modified_by: null;
}


// Labor cost center
export interface LaborCostCenter {
    id:          string;
    date:        Date;
    labor_name:  string;
    labor_code:  string;
    total_area:  string;
    crop_code:   string;
    cusa_cost:   string;
    labor_cost:  number;
    fuel_liters: string;
    fuel_price:  string;
    fuel_cost_usd:   number;
    total_cost:  number;
    lots:        LotCostCenter[];
    task:        string;
}

export interface LotCostCenter {
    id:      string;
    name:    string;
    area:    string;
    sublot?: SublotCostCenter;
}


export interface SublotCostCenter {
    id:   string;
    name: string;
}

// Raf cost center
export interface RafCostCenter {
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
    lots:          LotCostCenter[];
    products:      ProductCostCenter[];
    task:          string;
}

export interface ProductCostCenter {
    product_name: string;
    quantity:     string;
    unit:         null | string;
    total_price:  string;
}

// Seed map cost center
export interface SeedMapCostCenter {
    id:                string;
    date:              Date;
    crop_code:         string;
    labor:             string;
    first_equipment:   EquipmentCostCenter;
    second_equipment:  EquipmentCostCenter;
    grooves:           string;
    total_area:        string;
    cusa_cost:         string;
    labor_cost:        number;
    fuel_liters:       string;
    fuel_liters_total: number;
    fuel_cost_usd:     number;
    fuel_price:         number;
    total_cost:        number;
    lots:              LotCostCenter[];
    products:          ProductCostCenter[];
    task:              string;
}

// Irrigation cost center
export interface IrrigationCostCenter {
    id:                        string;
    date:                      Date;
    crop_code:                 string;
    name:                      null;
    first_equipment:           string;
    second_equipment:          null;
    cost_mother_line:          number;
    meters_of_line_mother:     number;
    total_hours:               number;
    max_maintenance_hours:     number;
    maintenance_cost_per_hour: number;
    fuel_consumption_per_hour: number;
    total_area:                number;
    irrigation_hours:          IrrigationHour[];
    lots:                      LotCostCenter[];
    products:                  ProductCostCenter[];
    fuel_cost_usd:             number;
    maintenance_cost_usd:      number;
    total_cost:                number;
}

export interface IrrigationHour {
    id:                   string;
    date:                 Date;
    hours:                number;
    fuel_cost_usd:        number;
    maintenance_cost_usd: number;
    lots:                 LotCostCenter[];
}

// Fertirriego cost center
export interface FertirriegoCostCenter {
    id:             number;
    date:           Date;
    crop_id:        number;
    crop_code:      string;
    total_area:     number;
    date_creation:  number;
    user_create:    string;
    lots:           LotCostCenter[];
    products:       ProductCostCenter[];
    total_cost:     number;
}

export interface EquipmentCostCenter {
    code: null | string;
    name: null | string;
}

export interface PeriodCostCenter {
    start_date: Date;
    end_date:   Date;
}

export interface TotalsCostCenter {
    labors:    number;
    rafs:      number;
    seed_maps: number;
    irrigation: number;
    fertirriego: number;
    logistic_costs: number;
    wash_processes: number;
    tong_processes: number;
    maintenance_costs: number;
    other_expenses: number;
}

// Logistic cost center
export interface LogisticCostsCenter {
    id: number;
    inventory_code?: string;
    date: string;
    user_create: string;
    product: {
        id: number;
        ref?: string | null;
        label: string | null;
    };
    quantity: number;
    logistic_cost: number;
    type: 'internal' | 'field';
    origin_warehouse?: {
        id: number;
        label: string;
    };
    destination_warehouse: {
        id: number;
        label: string;
    };
    crop_code?: string;
    harvest_details?: {
        lot: string;
        variety: string;
        variety_code: string;
        type: string;
        sublote_id: number;
    };
}

export interface WarehouseCostCenter {
    id:    number;
    label: string;
}

export interface ProductCostCenter {
    id:    number;
    ref:   null;
    label: null;
}


// Wash process cost center
export interface WashProcessCostCenter {
    id:              number;
    date:            Date;
    crop_code:       string;
    parent_potato:   PotatoCostCenter;
    potato:          PotatoCostCenter;
    warehouse:       WarehouseWashCostCenter;
    costs:           { [key: string]: number };
    process_details: ProcessDetailsCostCenter;
    total_cost:      number;
}

export interface PotatoCostCenter {
    ref:   string;
    label: string;
}

export interface ProcessDetailsCostCenter {
    number_of_bins: number;
    mermas:         number;
    quality_bags:   QualityBagCostCenter[];
    total_bags:     number;
}

export interface QualityBagCostCenter {
    quality: string;
    label:   string | null;
    bags:    number;
}

export interface WarehouseWashCostCenter {
    id:  number;
    ref: string;
}



// Tong cost center

export interface TongProcessCostCenter {
    id:              number;
    date:            Date;
    crop_code:       null;
    parent_potato:   PotatoTongCostCenter;
    potato:          PotatoTongCostCenter;
    costs:           CostsTongCostCenter;
    process_details: ProcessDetailsTongCostCenter;
    total_cost:      number;
}

export interface CostsTongCostCenter {
    fuel: FuelTongCostCenter;
    lift: number;
    gata: number;
}

export interface FuelTongCostCenter  {
    liters: number;
    cost:   number;
}

export interface PotatoTongCostCenter {
    id:  number;
    ref: string;
}

export interface ProcessDetailsTongCostCenter {
    number_of_bins: number;
    caliber_bins:   CaliberBinTongCostCenter[];
}

export interface CaliberBinTongCostCenter {
    name: string;
    bins: number;
}

export interface MaintenanceCostCenter {
    id:                   string;
    date:                 Date;
    machinery:            MachineryMaintenance;
    other_expenses:       number;
    expenses_description: string;
    general_description:  string;
    products:             ProductMaintenance[];
    total_cost:           number;
    task:                 string;
}

export interface MachineryMaintenance {
    id:   string;
    name: string;
    code: string;
}

export interface ProductMaintenance {
    id:              string;
    ref:             string;
    label:           string;
    quantity:        number;
    price:           number;
    total_price:     number;
    total_price_usd: number;
}





// Depreciation cost center
export interface DepreciationCostForm {
    machinery_id: string;
    date_start: Date;
    util_life: number;
    purchase_value: number;
    residual_value: number;
    name: string;
    description: string;
}


export interface DepreciationList {
    id:                 number;
    date_start:         Date;
    util_life:          number;
    purchase_value:     number;
    residual_value:     number;
    depreciation_value: number;
    name:               string;
    description:        string;
    machinery:          MachineryDepreciation;
    audit:              Audit;
}

export interface Audit {
    created_by:        string;
    modified_by:       null;
    date_creation:     Date;
    date_modification: Date;
}

export interface MachineryDepreciation {
    id:                number;
    code:              string;
    name:              string;
    brand:             string;
    model:             string;
    year_fabrication:  number;
    year_purchase:     number;
    state:             string;
    plate:             null;
    maintenance_hours: number;
    padron:            null;
    id_padron:         null;
    insurance:         null;
    status:            number;
}


// Other expenses cost center

export interface OtherExpensesCostForm {
    date: Date;
    name: string;
    description: string;
    amount_pesos: number;
    amount_usd: number;
    crop_code: string;
}


export interface OtherExpenseCostList {
    id:          number;
    date:        Date;
    name:        string;
    description: string;
    amounts:     AmountOtherExpense;
    crop:        CropOtherExpense | null;
    audit:       Audit;
}

export interface AmountOtherExpense {
    pesos:         number;
    usd:           number;
    exchange_rate: number;
}

export interface CropOtherExpense {
    id:      number;
    code:    string;
    cultivo: string;
}
