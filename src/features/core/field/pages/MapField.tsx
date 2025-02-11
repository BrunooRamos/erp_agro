import { LatLngExpression } from "leaflet";
import { FeatureGroup, MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet"
import { useField } from "../../../../hooks";
import { MapResponse } from "../../../../interfaces";
import { getRandomColor } from "../../../../helpers";

export const MapField = () => {
    const initialCoordinates: LatLngExpression = [-34.656000, -56.592136];
    const zoomLevel = 13;
    
    const { getMapFields } = useField();
    const { data: fields = [], isLoading } = getMapFields as { data: MapResponse[], isLoading: boolean };

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Mapa de Campos</h1>
            
            <div className="w-full h-[500px]">
                <MapContainer
                    center={initialCoordinates}
                    zoom={zoomLevel}
                    className="h-full w-full rounded-xl shadow-lg border border-gray-200"
                >
                    <TileLayer
                        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                        attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
                    />
                    <FeatureGroup>
                        {fields.map((field) => {
                            const color = getRandomColor();
                            return (
                                <Polygon
                                    key={field.id}
                                    positions={field.coordinates}
                                    pathOptions={{
                                        color: color,
                                        fillColor: color,
                                        fillOpacity: 0.3,
                                        weight: 3,
                                    }}
                                >
                                    <Tooltip permanent>
                                        {field.name}
                                    </Tooltip>
                                </Polygon>
                            );
                        })}
                    </FeatureGroup>
                </MapContainer>
            </div>

            <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4">Detalle de Campos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fields.map((field) => (
                        <div
                            key={field.id}
                            className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-lg font-semibold mb-2">{field.name}</h3>
                            <div className="text-sm text-gray-600">
                                <p>ID: {field.id}</p>
                                <p>Área Web: {field.area_web.toFixed(2)} hectáreas</p>
                                <p>Coordenadas:</p>
                                <ul className="ml-4 text-xs">
                                    {field.coordinates.map((coord, idx) => (
                                        <li key={idx}>
                                            Lat: {coord[0].toFixed(6)}, Lng: {coord[1].toFixed(6)}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};