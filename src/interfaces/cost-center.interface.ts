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
}

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
}
