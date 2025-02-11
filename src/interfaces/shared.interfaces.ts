export interface MapResponse {
    id: number;
    name: string;
    area_web: number;
    campo_name?: string;
    coordinates: [number, number][];
}