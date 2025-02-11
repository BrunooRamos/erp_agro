
export interface CropLot {
    id_lote: string,
    area_utilizada: number
}

export interface CropLotResponse {
    id_lote: string;
    area_utilizada: number;
    name: string;
    area_total: number;
    campo_name: string;
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