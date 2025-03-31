export interface FieldForm {
    name: string;
    area_web: number;
    area_real: number;
    rented: boolean;
    description?: string;
    location?: string;
    coordinates?: [number, number][];
    period?: string;
    rent_cost?: number;
}   

export interface FieldEntity {
    rowid: string;
    name: string;
    description: string;
    location: string;
    area_real: number;
    area_web: number;
    rented: string;
    period: string;
    rent_cost: string;
    fk_user_creat: string;
    fk_user_modif: string | null;
    status: string;
    date_creation: string;
    tms: string;
    user_creation: string;
    user_modification: string | null;
}


export interface FieldWithCoords extends FieldEntity {
    coordinates: [number, number][];
}

