export interface MapResponse {
    id: number;
    name: string;
    area_web: number;
    campo_name?: string;
    coordinates: [number, number][];
}



export interface WarehouseResponse {
    id:         number;
    name:       string;
    warehouses: Warehouse[];
}

export interface Warehouse {
    id:          number;
    ref:         string;
    location:    string;
    description: string;
}
