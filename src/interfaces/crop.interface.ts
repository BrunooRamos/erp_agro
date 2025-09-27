
// Create crop
export interface CropForm {
    code: string;
    codigo_campo: number;
    cultivo: string;
    periodo: string;
    anio: string;
    etapa: string;
    description: string;
    status: number;
    lots: CropLot[];
    sub_lots?: CropSubLot[];
}

export interface CropLot {
    id_lote: number,
    area_utilizada: number
}

export interface CropSubLot {
    id_parent_lot: number;
    name: string;
    area_utilizada: number;
}

export interface CropEntity {
    rowid:             string;
    code:              string;
    codigo_campo:      string;
    cultivo:           string;
    periodo:           string;
    anio:              string;
    etapa:             string;
    description:       string;
    date_creation:     Date;
    tms:               Date;
    fk_user_creat:     string;
    fk_user_modif:     null;
    status:            string;
    user_creation:     string;
    user_modification: null;
    campo_name:        string;
    lots:              Lot[];
}

interface Lot {
    id:             number;
    lot_id:         number;
    name:           string;
    area_real:      number;
    area_web:       number;
    area_utilizada: number;
    description:    string;
    sub_lots:       SubLot[];
}

interface SubLot {
    id:             number;
    name:           string;
    area_utilizada: number;
}


export interface CropWithLot {
    rowid:             string;
    code:              string;
    codigo_campo:      string;
    cultivo:           string;
    periodo:           string;
    anio:              string;
    etapa:             string;
    description:       null;
    status:            string;
    date_creation:     number;
    tms:               number;
    user_creation:     string;
    user_modification: string;
    lots:              CropLotResponse[];
}

export interface CropLotResponse {
    id_lote:        number;
    name:           string;
    area_total:     number;
    area_utilizada: number;
    campo_name:     string;
    sub_lots?:      CropSubLot[];
}
