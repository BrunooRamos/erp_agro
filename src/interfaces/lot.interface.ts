
export interface LotForm {
    name: string;
    codigo_campo: number;
    area_real: number;
    area_web: number;
    description?: string;
    coordinates?: [number, number][];
}


export interface LotEntity {
    rowid:             string;
    name:              string;
    fk_campo:          string;
    area_real:         string;
    area_web:          string;
    description:       string;
    fk_user_creat:     string;
    fk_user_modif:     null;
    date_creation:     Date;
    tms:               Date;
    status:            string;
    campo_name:        string;
    user_creation:     string;
    user_modification: null;
    coordinates:       [number, number][];
}
