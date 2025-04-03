import {
    SelectedProducts,
    SelectedSubLot,
    SelectedLot as SelectedLotRegister,
  } from "./register.interface";
  
  export interface IrrigationFormInterface {
    name: string;
    date: string;
    crop_id: string;
    cost_id: string;
    meters_of_line_mother: number;
    first_equipment: string;
    second_equipment?: string;
    selectedLots: SelectedLotIrrigation[];
    selectedSublots: SelectedSublotIrrigation[];
    selectedMaterials: SelectedMaterialIrrigation[];
  }
  
  export interface IrrigationHoursSendData {
    date: string;
    hours: number;
    irrigation_id: string;
    cost_id: string;
    lots_irrigated: SelectedLotRegister[];
    sublots_irrigated: SelectedSubLot[];
  }
  
  export interface IrrigationCostForm {
    cost_mother_line: number;
    fuel_consumption_per_hour: number;
    maintenance_hours: number;
    maintenance_cost: number;
  }
  
  export interface IrrigationCostResponse extends IrrigationCostForm {
    id: number;
    date_creation: Date;
    date_modification: Date;
  }
  
  // Fertirriego
  
  export interface IrrigationFertirriegoSendData {
    date: string;
    irrigation_id: string;
    selectedLots: SelectedLotRegister[];
    selectedSublots: SelectedSubLot[];
    selectedMaterials: SelectedProducts[];
  }
  
  //Todo esto es del IrrigationResponse
  
  export interface IrrigationResponse {
    rowid: number;
    date: Date;
    crop_id: number;
    crop_code: string;
    meters_of_line_mother: number;
    cost_id: number;
    cost_info: CostInfoIrrigation;
    first_equipment: string;
    second_equipment: null;
    date_creation: number;
    date_modification: number;
    selectedLots: SelectedLotIrrigation[];
    selectedSublots: SelectedSublotIrrigation[];
    selectedMaterials: SelectedMaterialIrrigation[];
    machinaryUsed: MachinaryUsedIrrigation[];
  }
  
  export interface CostInfoIrrigation {
    cost_mother_line: number;
    fuel_consumption_per_hour: number;
    maintenance_hours: number;
    maintenance_cost: number;
    status: number;
  }
  
  export interface MachinaryUsedIrrigation {
    rowid: string;
    name: string;
    brand: string;
    model: string;
  }
  
  export interface SelectedLotIrrigation {
    rowid: string;
    name: string;
    campo_name: string;
    area_utilizada: number;
  }
  
  export interface SelectedMaterialIrrigation {
    id: string;
    label: string;
    ref: string;
    quantity: number;
    warehouse_id: string;
    type: string;
    presentation: number;
    unit: string;
    total_price: number;
    total_price_usd: number;
  }
  
  export interface SelectedSublotIrrigation {
    id_sub_lote: string;
    id_parent_lote: string;
    name: string;
    area_utilizada: number;
  }
  
  // Todo esto es del IrrigationInfoResponse
  export interface IrrigationInfoResponse {
    irrigation:        IrrigationInfoResponse;
    selectedLots:      SelectedLotInfoResponse[];
    selectedSublots:   SelectedSublotInfoResponse[];
    selectedMaterials: SelectedMaterialInfoResponse[];
    hours:             HourInfoResponse[];
    fertirriego:       FertirriegoInfoResponse;
}

export interface FertirriegoInfoResponse {
    rowid:             string;
    date:              Date;
    total_area:        number;
    selectedMaterials: SelectedMaterialInfoResponse[];
    selectedLots:      SelectedLotInfoResponse[];
    selectedSublots:   SelectedSublotInfoResponse[];
}

export interface SelectedMaterialInfoResponse {
    id:           string;
    label:        string;
    unit:         string;
    presentation: number;
    type:         string;
    quantity:     number;
    warehouse_id: string;
}

export interface SelectedLotInfoResponse {
    id_lote:        string;
    name:           string;
    campo_name:     string;
    area_utilizada: number;
}

export interface SelectedSublotInfoResponse {
    id_sub_lote:    string;
    id_parent_lote: string;
    name:           string;
    area_utilizada: number;
}

export interface HourInfoResponse {
    rowid:                     string;
    date:                      Date;
    hours:                     number;
    cost_id:                   string;
    fuel_consumption_per_hour: number;
    maintenance_hours:         number;
    maintenance_cost:          number;
}

export interface IrrigationInfoResponse {
    rowid:                 string;
    crop_id:               string;
    crop_code:             string;
    date:                  Date;
    meters_of_line_mother: number;
    first_equipment:       EquipmentInfoResponse;
    second_equipment:      EquipmentInfoResponse;
    date_creation:         number;
    date_modification:     number;
    user_creation:         string;
    user_modification:     null;
}

export interface EquipmentInfoResponse {
    id:    null | string;
    name:  null | string;
    code:  null | string;
    brand: null | string;
    model: null | string;
}

