import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  MapContainerProps,
  Polygon as LeafletPolygon,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import { Polygon } from "leaflet";
import area from '@turf/area';

interface MapPolygonProps extends MapContainerProps {
  initialCoordinates: [number, number];
  existingPolygon?: [number, number][];
  zoomLevel?: number;
  onPolygonComplete?: (polygon: [number, number][], hectares: number) => void;
}

const calculateArea = (coordinates: [number, number][]) => {
    if (coordinates.length < 3) return 0;
    
    const turfPolygon = {
      type: "Feature" as const,
      properties: {},
      geometry: {
        type: "Polygon" as const,
        coordinates: [[...coordinates.map(coord => [coord[1], coord[0]]), [coordinates[0][1], coordinates[0][0]]]]
      }
    };
    
    const areaInSquareMeters = area(turfPolygon);
    return areaInSquareMeters / 10000;
};


export const MapPolygon: React.FC<MapPolygonProps> = ({
  initialCoordinates,
  existingPolygon,
  zoomLevel = 12,
  onPolygonComplete,
  ...props
}) => {
  const [polygonPoints, setPolygonPoints] = useState<[number, number][]>(existingPolygon || []);
  const [, setHectares] = useState<number>(existingPolygon ? calculateArea(existingPolygon) : 0);
  const [, setIsEditing] = useState(false);



  // Manejar la creación de un polígono
  const handleCreated = (e: { layerType: string; layer: Polygon }) => {
    const { layerType, layer } = e;
    if (layerType === "polygon") {
      const coordinates = layer
        .getLatLngs()[0]
        .map((point: { lat: number; lng: number }) => [point.lat, point.lng]);
      setPolygonPoints(coordinates);
      const calculatedHectares = calculateArea(coordinates);
      setHectares(calculatedHectares);
      if (onPolygonComplete) {
        onPolygonComplete(coordinates, calculatedHectares);
      }
    }
  };

  // Manejar la edición de un polígono
  const handleEdited = (e: any) => {
    setIsEditing(false);
    e.layers.eachLayer((layer: Polygon) => {
      const updatedCoordinates = layer
        .getLatLngs()[0]
        .map((point: { lat: number; lng: number }) => [point.lat, point.lng]);

      setPolygonPoints(updatedCoordinates);
      const calculatedHectares = calculateArea(updatedCoordinates);
      setHectares(calculatedHectares);
      
      if (onPolygonComplete) {
        onPolygonComplete(updatedCoordinates, calculatedHectares);
      }
    });
  };

  // Manejar el inicio de la edición
  const handleEditStart = () => {
    setIsEditing(true);
  };

  // Agregar manejador para eliminación
  const handleDeleted = () => {
    setPolygonPoints([]);
    setHectares(0);
    if (onPolygonComplete) {
      onPolygonComplete([], 0);
    }
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={initialCoordinates}
        zoom={zoomLevel}
        className="h-[500px] w-full rounded-xl shadow-lg border border-gray-200"
        {...props}
      >
        <TileLayer
          url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
          attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
        />
        <FeatureGroup>
          {polygonPoints.length > 0 && (
            <LeafletPolygon
              positions={polygonPoints}
              pathOptions={{
                color: '#3b82f6',
                fillColor: '#60a5fa',
                fillOpacity: 0.3,
                weight: 3,
              }}
            />
          )}
          <EditControl
            position="topright"
            onCreated={handleCreated}
            onEdited={handleEdited}
            onEditStart={handleEditStart}
            onDeleted={handleDeleted}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
              polygon: {
                allowIntersection: false,
                drawError: {
                  color: "#ef4444",
                  message: "<strong>No se permite intersección!</strong>",
                },
                shapeOptions: {
                  color: "#3b82f6",
                  fillColor: "#60a5fa",
                  fillOpacity: 0.3,
                  weight: 3,
                },
              },
            }}
            edit={{
              featureGroup: {
                edit: {
                  selectedPathOptions: {
                    color: '#3b82f6',
                    fillColor: '#60a5fa',
                    fillOpacity: 0.3,
                    weight: 3,
                  }
                },
                remove: true
              }
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};
