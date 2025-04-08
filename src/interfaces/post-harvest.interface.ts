//!TONG
export interface TongProccesForm {
  date: string;
  number_of_bins: number;
  caliber: Caliber[];
  parent_potato_id: string;
  potato_id: string;
  caliber_outputs: CaliberOutput[];
  warehouse_id: number;
  tong_cost_id: string;
  other_cost: number;
}

// Tong cost
export interface CreateTongCostForm {
  date: string;
  max_bins: number;
  fuel_liters: number;
  lift_cost: number;
  gata_cost: number;
}

export interface TongCost extends CreateTongCostForm {
  id: number;
  fuel_cost: number
}

// Tong caliber output
export interface CaliberOutput {
  caliber_id: number;
  caliber_name: string;
  bins: number;
}

export interface Caliber extends CreateCaliberForm {
  id: number;
  amount: number;
}

export interface CreateCaliberForm {
  name: string;
  description: string;
}



// Tong response
export interface TongProcessResponse {
  rowid:              string;
  date:               Date;
  input_bins:         string;
  potato_id:          string;
  potato_name:        string;
  potato_variety:     string;
  parent_potato_id:   string;
  parent_potato_name: string;
  user_created:       string;
  date_creation:      null;
  costs:              CostResponse[];
  caliber_outputs:    CaliberOutputResponse[];
}

export interface CaliberOutputResponse {
  rowid:        string;
  caliber_id:   number;
  caliber_name: string;
  bins:         number;
}

export interface CostResponse {
  rowid:       string;
  date:        Date;
  fuel_liters: string;
  fuel_cost:   string;
  lift_cost:   string;
  gata_cost:   string;
  total_cost:  number;
}

//!WASH
export interface CreateQualityForm {
  name: string;
  description: string;
  label: LabelForm;
}

export interface WashQualityResponse {
  rowid:        string;
  quality:      LabelForm;
  label:        LabelForm;
  user_created: string;
}

export interface LabelForm {
  name: string;
  descripcion: string;
}



export interface CostWashForm {
  date: string;
  energy_cost: number;
  maintenance_cost: number;
  bag_cost: number;
  film_cost: number;
  thread_cost: number;
  pallet_cost: number;
  label_cost: number;
  lift_cost: number;
  other_cost: number;
  total_cost: number;
}

export interface CostWashResponse extends CostWashForm {
  rowid: string;
}


export interface WashProcessForm {
  date: string;
  parent_potato_id: string;
  potato_id: string;
  number_of_bins: number;
  warehouse_id: number;
  quality_outputs: QualityOutput[];
  wash_cost_id: string;
  other_cost: number;
}

export interface QualityOutput {
  quality_id: number;
  bags: number;
}
