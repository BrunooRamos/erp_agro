import { MachineryLight } from "./machinery.interface";

export interface GeneralLabor {
  date: string;
  labor_code: string;
  cusa_cost: number;
  lts: number;
  first_equipment: string;
  second_equipment?: string;
  crop_code: string;
  selectedLots: SelectedLot[];
  selectedSublots: SelectedSubLot[];
}

export interface SeedMapRegisterInterface {
  date: string;
  crop_id: string;
  cusa_id: string;
  first_equipment: string;
  second_equipment?: string;
  selectedLots: SelectedLot[];
  selectedSeeds: SelectedProducts[];
  selectedChemicals: SelectedProducts[];
  selectedSublots: SelectedSubLot[];
  grooves?: number;
}

// List RAF

export interface RAFRegister {
  raf:      RAFRegisterInfo;
  lots:     RAFRegisterLot[];
  products: RAFRegisterProduct[];
}

export interface RAFRegisterLot {
  rowid:       string;
  name:        string;
  campo_name:  string;
  area_total:  number;
  description: string;
  sublots:     RAFRegisterSublot[];
}

export interface RAFRegisterSublot {
  id:             string;
  name:           string;
  area_utilizada: number;
}

export interface RAFRegisterProduct {
  product_name:      string;
  product_ref:       string;
  rowid:             string;
  fk_product:        string;
  quantity:          number;
  warehouse_id:      string;
  type:              string;
  stock_used:        number;
  total_price:       number;
  total_price_usd:   number;
  date_creation:     Date;
  warehouse_name:    string;
  unit:              string;
  tipo_presentacion: string;
  presentacion:      number;
  medida:            string;
  dosisha:           number;
  variedad:          null;
}

export interface RAFRegisterInfo {
  rowid:             string;
  crop_id:           string;
  crop_code:         string;
  cusa_id:           string;
  first_equipment:   string;
  second_equipment:  null;
  date:              Date;
  type:              string;
  sub_type:          string;
  total_area:        number;
  lts:               number;
  description:       null;
  user_creation:     string;
  user_modification: null;
  date_creation:     Date;
  tms:               Date;
}


// List seed map

export interface SeedMapRegister {
  seed_map: SeedMapRegisterInfo;
  lots:     LotSeedMap[];
  products: ProductSeedMap[];
}

export interface LotSeedMap {
  rowid:       string;
  name:        string;
  campo_name:  string;
  area_total:  number;
  description: string;
  sublots:     SublotSeedMap[];
}

export interface SublotSeedMap {
  id:             string;
  name:           string;
  area_utilizada: number;
}

export interface ProductSeedMap {
  product_name:      string;
  product_ref:       string;
  rowid:             string;
  fk_product:        string;
  quantity:          number;
  warehouse_id:      string;
  type:              string;
  stock_used:        number;
  total_price:       number;
  total_price_usd:   number;
  warehouse_name:    string;
  unit:              string;
  tipo_presentacion: string;
  presentacion:      number;
  medida:            string;
  dosisha:           number;
  variedad:          null;
}

export interface SeedMapRegisterInfo {
  rowid:             string;
  crop_id:           string;
  crop_code:         string;
  cusa_id:           string;
  cusa_code:         string;
  date:              Date;
  first_equipment:   EquipmentSeedMap;
  second_equipment:  EquipmentSeedMap;
  lts:               number;
  grooves:           number;
  date_creation:     number;
  date_modification: number;
  user_creation:     string;
  user_modification: null;
}

export interface EquipmentSeedMap {
  id: null | string;
}





export interface CategoryResponse {
  rowid: number;
  label: string;
  parent_id: number;
  description: string;
  subcategories: CategoryResponse[];
}

export interface ArrayOptions {
  options_tipo_presentacion: string;
  options_medida: string;
  options_dosisha: string;
  options_presentacion: string;
}

export interface Warehouse {
  id: number;
  ref: string;
  stock: number;
}

export interface ProductsResponse {
  id: string;
  entity: string;
  array_options: ArrayOptions;
  ref: string;
  date_creation: Date;
  label: string;
  parent_key: string;
  subcategory_id: string;
  subcategory_name: string;
  warehouses: Warehouse[];
}

export interface SelectedLot {
  id_lote: string;
  area_utilizada: number;
}

export interface SelectedSubLot {
  id_sub_lote: string;
  id_parent_lote: string;
  name: string;
  area_utilizada: number;
}

export interface SelectedProducts {
  id: string;
  label: string;
  quantity: number;
  unit: string;
  presentation: number;
  type?: string;
  warehouse_id: string;
}

export interface RAFSendData {
  crop_id: string;
  cusa_id: string;
  date: string;
  selectedLots: SelectedLot[];
  selectedSublots: SelectedSubLot[];
  selectedProducts: SelectedProducts[];
  sub_type: string;
  type: string;
  first_equipment: string;
  second_equipment?: string;
}


export interface GeneralLaborResponse {
  date: string;
  labor_code: string;
  cusa_cost: number;
  lts: number;
  first_equipment: string;
  second_equipment?: string;
  crop_code: string;
  selectedSublots: SelectedSubLot[];
  selectedLots: Lot[];
  machinaryUsed: MachineryLight[];  
}

export interface ProductsResponse {
  product_name: string;
  product_ref: string;
  quantity: number;
  type: string;
  unit: string;
  warehouse_name: string;
  total_price: number;
  total_price_usd: number;
}

export interface Lot {
  rowid: string;
  name: string;
  campo_name: string;
  area_utilizada: number;
}





