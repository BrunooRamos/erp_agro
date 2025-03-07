
export interface MovementForm {
    date: string;
    lot: string;
    crop: string;
    warehouse_id: string;
    quantity: number;
    variety: string;
    logistic_cost: number;
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