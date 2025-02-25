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
    labor: string;
    cusa_cost: number;
    lts: number;
    maintenance_hours: number;
    padron: string;
    id_padron: string;
    insurance: string;
}

export interface CusaInfo {
    cod_laboreo: string;
    laboreo:     string;
    precio_cusa: number;
    lts_ha:      number;
}

export interface MachineryEntity {
    rowid:             string;
    code:              string;
    name:              string;
    brand:             string;
    model:             string;
    year_fabrication:  number | null;
    description:       string | null;
    year_purchase:     number | null;
    plate:             string | null;
    labor:             string | null;
    cusa_cost:         number | null;
    lts:               number | null;
    maintenance_hours: number | null;
    padron:            string | null;
    id_padron:         string | null;
    insurance:         string | null;
    date_creation:     Date | null;
    tms:               Date | null;
    fk_user_creat:     string | null;
    fk_user_modif:     string | null;
    import_key:        string | null;
    status:            string | null;
    user_creation:     string | null;
    user_modification: string | null;
}


export interface MachineryLight {
    rowid: string;
    name: string;
    brand: string;
    model: string;  
}