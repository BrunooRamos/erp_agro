
export interface MovementForm {
    date: string;
    lot: string;
    crop: string;
    warehouse_id: string;
    quantity: number;
    variety: string;
    variety_code: string;
    logistic_cost: number;
    type: string;
    sublot: string;
    document_number?: string;
}

export interface LogisticCostForm {
    date: string;
    kilometeres: number;
    cost: number;
    origin: string;
    destination?: string;
}

export interface LogisticCostResponse extends LogisticCostForm {
    id: number;
    date_creation: Date;
    user_created:  number;
}


export interface PotatoHarvestResponse {
    id:            number;
    date:          string;
    crop:          string;
    warehouse_id:  number;
    warehouse_ref: string;
    logistic_cost: number;
    lot:           string;
    variety:       string;
    variety_code:  string;
    type:          string;
    quantity:      number;
    date_creation: string;
    user_created:  number;
}


export interface MouvementsHistoric {
    id:        number;
    date:      Date;
    crop:      CropHistoric;
    warehouse: ProductHistoric;
    logistics: LogisticsHistoric;
    variety:   VarietyHistoric;
    type:      string;
    quantity:  number;
    product:   ProductHistoric;
    dates:     DatesHistoric;
    lot_info:       LotInfo;
    sublote:       SublotHistoric;
}

export interface LotInfo {
    id:          number;
    name:        string;
    area:        AreaHistoric;
    description: string;
    status:      number;
    dates:       DatesHistoric;
    users:       UsersHistoric;
}

export interface AreaHistoric {
    real: number;
    web:  number;
}

export interface UsersHistoric {
    created_by:  string;
    modified_by: null;
}

export interface CropHistoric {
    id:    number;
    ref:   string;
    label: string;
}

export interface DatesHistoric {
    created:  Date;
    modified: Date;
}

export interface LogisticsHistoric {
    id:          number;
    cost:        number;
    kilometers:  number;
    origin:      string;
    destination: string;
}

export interface ProductHistoric {
    id:  number;
    ref: string;
}

export interface VarietyHistoric {
    name: string;
    code: string;
}

export interface SublotHistoric {
    id:             number;
    name:           string;
    area_utilizada: number;
    dates:          DatesHistoric;
}




// Sublots for create movement
export interface SublotResponse {
    id:             number;
    name:           string;
    area_utilizada: number;
    dates:          DatesSublot;
    cultivo_lote:   CultivoLoteSublot;
    lot:            LotSublot;
}

export interface CultivoLoteSublot {
    id:             number;
    area_utilizada: number;
}

export interface DatesSublot {
    created:  Date;
    modified: Date;
}

export interface LotSublot {
    name:        string;
    area:        AreaSublot;
    description: string;
    field:       FieldSublot;
}

export interface AreaSublot {
    real: number;
    web:  number;
}

export interface FieldSublot {
    ref:   string;
    label: string;
}
