import { SelectedProducts, SelectedSubLot, SelectedLot as SelectedLotRegister } from "./register.interface";

export interface IrrigationFormInterface {
    date: string;
    first_equipment: string;
    second_equipment?: string; 
    crop_code: string;
    meters_of_line_mother: number;
    cost_mother_line: number;
    selectedLots: SelectedLot[];
    selectedSublots: SelectedSubLot[];
    selectedMaterials: SelectedProducts[];
}


export interface IrrigationHoursSendData {
    date: string;
    hours: number;
    crop_code: string;
    lots_irrigated: SelectedLotRegister[];
    sublots_irrigated: SelectedSubLot[];
}


export interface IrrigationCostForm {
    cost_mother_line:          number;
    fuel_consumption_per_hour: number;
    maintenance_hours:         number;
    maintenance_cost:          number;
}



export interface IrrigationCostResponse extends IrrigationCostForm {
    id:                        number;
    date_creation:             Date;
    date_modification:         Date;
}


// Fertirriego

export interface IrrigationFertirriegoSendData {
    crop_code: string;
    date: string;
    selectedLots: SelectedLotRegister[];
    selectedSublots: SelectedSubLot[];
    selectedMaterials: SelectedProducts[];
}


//Todo esto es del IrrigationResponse

export interface IrrigationResponse {
    irrigation:      Irrigation;
    selectedLots:    SelectedLot[];
    selectedSublots: SelectedSublot[];
    materials:       Material[];
}

export interface Irrigation {
    rowid:                 string;
    crop_code:             string;
    date:                  Date;
    meters_of_line_mother: string;
    cost_mother_line:      string;
    first_equipment:       Equipment;
    second_equipment:      Equipment;
    date_creation:         number;
    date_modification:     number;
    user_creation:         string;
    user_modification:     null;
}

interface Equipment {
    id:  null | string;
    ref: null;
}

interface Material {
    rowid?:           string;
    product_name:    string;
    product_ref:     string;
    quantity:        number;
    type:            string;
    warehouse_name:  string;
    total_price:     number;
    total_price_usd: number;
}

interface SelectedLot {
    rowid:          string;
    name:           string;
    campo_name:     string;
    area_utilizada: number;
}

interface SelectedSublot {
    id_sub_lote:    string;
    id_parent_lote: string;
    name:           string;
    area_utilizada: number;
}


// Todo esto es del IrrigationInfoResponse
export interface IrrigationInfoResponse {
    irrigation:      IrrigationInfo;
    selectedLots:    SelectedLot[];
    selectedSublots: SelectedSublot[];
    materials:       Material[];
    hours:           Hour[];
    fertirriego:     Fertirriego[];
}

export interface Fertirriego {
    rowid:         string;
    date:          Date;
    total_area:    number;
    product_count: number;
    total_cost:    number;
    products:      Material[];
}

export interface Hour {
    rowid:                     string;
    date:                      Date;
    hours:                     number;
    fk_costs:                  string;
    fuel_consumption_per_hour: number;
    maintenance_hours:         number;
    maintenance_cost:          number;
}

export interface IrrigationInfo {
    rowid:                 string;
    crop_code:             string;
    date:                  Date;
    meters_of_line_mother: number;
    cost_mother_line:      number;
    first_equipment:       EquipmentInfo;
    second_equipment:      EquipmentInfo;
    date_creation:         number;
    date_modification:     number;
    user_creation:         string;
    user_modification:     null;
}

export interface EquipmentInfo {
    id:    null | string;
    name:  null | string;
    code:  null | string;
    brand: null | string;
    model: null | string;
}
