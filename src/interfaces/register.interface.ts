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
  labor_code: string;
  labor: string;
  cusa_cost: number;
  lts: number;
  first_equipment: string;
  second_equipment?: string;
  crop_code: string;
  selectedLots: SelectedLot[];
  selectedSeeds: SelectedProducts[];
  selectedChemicals: SelectedProducts[];
  selectedSublots: SelectedSubLot[];


  grooves?: number;
}

export interface RAFRegister {
  date: string;
  crop_code: string;
  type: string;
  sub_type: string;
  selected_products: string[];
  product_quantities: {
    [key: string]: number;
  };
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
  crop_code: string;
  date: string;
  selectedLots: SelectedLot[];
  selectedSublots: SelectedSubLot[];
  selectedProducts: SelectedProducts[];
  sub_type: string;
  type: string;
}



export interface MapSeedGetResponse {
  seed_map: SeedMap;
  lots: Lot[];
  products: ProductsResponse[];
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

export interface SeedMap {
  rowid: string;
  crop_code: string;
  date: Date;
  first_equipment: Equipment;
  second_equipment: Equipment;
  labor: string;
  cusa_cost: number;
  lts: number;
  grooves: number;
  date_creation: number;
  date_modification: number;
  user_creation: string;
  user_modification: null;
}

export interface Equipment {
  id: string;
  ref: null;
}
