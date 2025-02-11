export interface GeneralLabor {
    date: string;
    labor_code: string;
    cusa_cost: number;
    lts: number;
    first_equipment: string;
    second_equipment?: string; 
    crop_code: string;
    selectedLots: SelectedLot[];
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
    id:          number;
    label:       string;
    type:        string;
    description: string;
}






export interface ArrayOptions {
    options_tipo_presentacion: string;
    options_medida:            string;
    options_dosisha:           string;
    options_presentacion:      string;
}

export interface Warehouse {
    id:    number;
    ref:   string;
    stock: number;
}

export interface ProductsResponse {
    id:               string;
    entity:           string;
    array_options:    ArrayOptions;
    ref:              string;
    date_creation:    Date;
    label:            string;
    subcategory_id:   string;
    subcategory_name: string;
    warehouses:       Warehouse[];
}





export interface SelectedLot {
    id_lote:        string;
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
    crop_code:        string;
    date:             string;
    selectedLots:     SelectedLot[];
    selectedProducts: SelectedProducts[];
    sub_type:         string;
    type:             string;
}