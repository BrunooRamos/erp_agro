
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
