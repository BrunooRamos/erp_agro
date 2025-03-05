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


export interface PriceResponse {
    dolar: Dolar;
    fuels: Fuel[];
}

export interface Dolar {
    compra: number;
    moneda: string;
    venta:  number;
}

export interface Fuel {
    fuel:  string;
    price: number;
}

export interface PriceHistoricData {
    dollar: DollarHistoricData[];
    fuels:  FuelHistoricData[];
}   

export interface DollarHistoricData {
    id:     string;
    date:   Date;
    compra: number;
    venta:  number;
    avg:    number;
    moneda: string;
}

export interface FuelHistoricData {
    id:        string;
    date:      Date;
    super95:   number;
    premium97: number;
    gasoil10s: number;
    gasoil50s: number;
}
