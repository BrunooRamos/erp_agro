import { SelectedLot, SelectedProducts } from "./register.interface";

export interface IrrigationFormInterface {
    date: string;
    first_equipment: string;
    second_equipment?: string; 
    crop_code: string;
    selectedLots: SelectedLot[];
    selectedMaterials: SelectedProducts[];
}



export interface IrrigationHoursSendData {
    date: string;
    irrigation_hours: number;
}




export interface IrrigationResponse {
    irrigation: Irrigation;
    lots:       Lot[];
}

export interface Irrigation {
    rowid:             string;
    crop_code:         string;
    date:              Date;
    date_creation:     number;
    date_modification: number;
    user_creation:     string;
    user_modification: null;
}

interface Lot {
    id_lote:        string;
    name:           string;
    campo_name:     string;
    area_utilizada: number;
}
