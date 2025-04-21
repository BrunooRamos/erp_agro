export interface MachineryForm {
    code: string;
    name: string;
    brand: string;
    model: string;
    year_fabrication: number;
    description: string;
    year_purchase: number;
    state: string;
    plate: string;
    cusa_id: number;
    maintenance_hours: number;
    padron: string;
    id_padron: string;
    insurance: string;
}

export interface CusaInfo {
    rowid: number;
    cod_laboreo: string;
    laboreo:     string;
    precio_cusa: number;
    lts_ha:      number;
}

export interface MachineryEntity {
    rowid:             string;
    code:              string;
    cusa_id:           string;
    name:              string;
    brand:             string;
    model:             string;
    year_fabrication:  null;
    description:       null;
    year_purchase:     null;
    plate:             null;
    maintenance_hours: string;
    padron:            null;
    id_padron:         null;
    insurance:         null;
    date_creation:     Date;
    tms:               Date;
    fk_user_creat:     string;
    fk_user_modif:     null;
    import_key:        null;
    status:            string;
    user_creation:     string;
    user_modification: null;
    cusa:              Cusa;
}

export interface Cusa {
    id:          string;
    cod_laboreo: string;
    laboreo:     string;
    precio_cusa: number;
    lts_ha:      number;
}


export interface MachineryLight {
    rowid: string;
    name: string;
    brand: string;
    model: string;  
}



export interface MaintenanceFormData {
    machinery_id: string;
    date: string;
    products?: {
        product_id: string;
        quantity: number;
        warehouse_id: string;
    }[];
    other_expenses?: number;
    expenses_description?: string;
    general_description?: string;
}