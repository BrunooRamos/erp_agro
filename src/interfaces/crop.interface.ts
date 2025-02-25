
export interface CropLot {
    id_lote: string,
    area_utilizada: number
}

export interface CropSubLot {
    id_parent_lot: string;
    name: string;
    area_utilizada: number;
}

export interface CropForm {
    code: string;
    codigo_campo: string;
    cultivo: string;
    periodo: string;
    anio: string;
    etapa: string;
    description: string;
    status: number;
    lots: CropLot[];
    sub_lots?: CropSubLot[];
}

export interface CropEntity {
    rowid: string;
    code: string;
    codigo_campo: string | null;
    campo_name: string | null;
    cultivo: string | null;
    periodo: string | null;
    anio: string | null;
    etapa: string | null;
    description: string | null;
    date_creation: Date | null;
    tms: Date | null;
    fk_user_creat: string | null;
    fk_user_modif: string | null;
    status: string | null;
    user_creation: string | null;
    user_modification: string | null;
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
    id_lote:        string;
    name:           string;
    area_total:     number;
    area_utilizada: number;
    campo_name:     string;
}
