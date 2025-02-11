import { useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Polygon, FeatureGroup, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import { CropEntity } from '../../../../interfaces';
import { useCrop, useRegisters } from '../../../../hooks';
import { getRandomColor } from '../../../../helpers';

export const DetailsCost = () => {
    const location = useLocation();
    const crop = location.state?.crop as CropEntity;

    const initialCoordinates: LatLngExpression = [-34.656000, -56.592136];
    const zoomLevel = 13;

    // Get lots by crop
    const { getLotsByCropId } = useCrop(undefined, crop?.rowid);
    const { data: lots, isLoading } = getLotsByCropId;

    // Get RAF by crop
    const { rafByCropId } = useRegisters(crop?.code);
    const { data: raf, isLoading: isLoadingRAF } = rafByCropId;;
    
    if (isLoading || isLoadingRAF) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header Information */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h1 className="text-xl font-bold text-zinc-900">
                            {crop.code}
                        </h1>
                        <p className="text-sm text-zinc-500 flex items-center gap-1">
                            <i className="fa-solid fa-location-dot" />
                            {crop.campo_name || 'Sin ubicación'}
                        </p>
                    </div>
                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-600 text-xs font-medium rounded">
                        {crop.anio}
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase mb-0.5">
                            Cultivo
                        </p>
                        <p className="text-sm font-semibold text-zinc-800">
                            {crop.cultivo || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase mb-0.5">
                            Periodo
                        </p>
                        <p className="text-sm font-semibold text-zinc-800">
                            {crop.periodo || '-'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-zinc-400 uppercase mb-0.5">
                            Etapa
                        </p>
                        <p className="text-sm font-semibold text-zinc-800">
                            {crop.etapa || '-'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold mb-3">Mapa de Lotes</h2>
                <div className="w-full h-[400px]">
                    <MapContainer
                        center={initialCoordinates}
                        zoom={zoomLevel}
                        className="h-full w-full rounded-lg shadow-sm border border-gray-200"
                    >
                        <TileLayer
                            url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                            attribution='&copy; <a href="https://maps.google.com/">Google Maps</a>'
                        />
                        <FeatureGroup>
                            {lots?.map((lot) => {
                                const color = getRandomColor();
                                return (
                                    <Polygon
                                        key={lot.rowid}
                                        positions={lot.coordinates}
                                        pathOptions={{
                                            color: color,
                                            fillColor: color,
                                            fillOpacity: 0.3,
                                            weight: 3,
                                        }}
                                    >
                                        <Tooltip permanent>
                                            {lot.name} - {lot.area_real} ha
                                        </Tooltip>
                                    </Polygon>
                                );
                            })}
                        </FeatureGroup>
                    </MapContainer>
                </div>
            </div>

            {/* RAF Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold">Registros de Aplicación Fitosanitaria</h2>
                    <span className="text-sm text-zinc-500">
                        {raf?.length || 0} registros
                    </span>
                </div>
                
                {raf && raf.length > 0 ? (
                    <div className="space-y-4">
                        {raf.map((register) => (
                            <div 
                                key={register.raf.rowid}
                                className="border border-gray-200 rounded-lg p-4 hover:border-zinc-300 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                            <i className="fa-solid fa-spray-can-sparkles text-emerald-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-zinc-900">
                                                {register.raf.type} - {register.raf.sub_type}
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                <i className="fa-regular fa-calendar-days mr-1" />
                                                {new Date(register.raf.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Products Section */}
                                {register.products.length > 0 && (
                                    <div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {register.products.map((product) => (
                                                <div 
                                                    key={product.product_ref}
                                                    className="bg-zinc-50/50 p-4 rounded-lg border border-zinc-100"
                                                >
                                                    <div className="flex justify-between items-center mb-3">
                                                        <div className="flex items-center gap-2">
                                                            <i className="fa-solid fa-bottle-droplet text-zinc-400" />
                                                            <span className="text-sm font-medium text-zinc-800">
                                                                {product.product_name}
                                                            </span>
                                                        </div>
                                                        <span className="text-sm font-medium text-zinc-700 bg-white px-2 py-1 rounded border border-zinc-200">
                                                            {product.quantity} {product.type}  - {product.warehouse_name}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-4 gap-4">
                                                        <div className="bg-white p-2 rounded border border-zinc-100">
                                                            <p className="text-xs text-zinc-400 uppercase mb-1">Stock Usado</p>
                                                            <p className="font-medium text-zinc-700">
                                                                {product.stock_used || 0} {product.type}
                                                            </p>
                                                        </div>
                                                        <div className="bg-white p-2 rounded border border-zinc-100">
                                                            <p className="text-xs text-zinc-400 uppercase mb-1">Precio UYU</p>
                                                            <p className="font-medium text-zinc-700">
                                                                {Number(product.total_price || 0).toLocaleString('es-UY', {
                                                                    style: 'currency',
                                                                    currency: 'UYU'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="bg-white p-2 rounded border border-zinc-100">
                                                            <p className="text-xs text-zinc-400 uppercase mb-1">Precio USD</p>
                                                            <p className="font-medium text-zinc-700">
                                                                {Number(product.total_price_usd || 0).toLocaleString('es-UY', {
                                                                    style: 'currency',
                                                                    currency: 'USD'
                                                                })}
                                                            </p>
                                                        </div>
                                                        <div className="bg-white p-2 rounded border border-zinc-100">
                                                            <p className="text-xs text-zinc-400 uppercase mb-1">Tipo de Cambio</p>
                                                            <p className="font-medium text-zinc-700">
                                                                {Number(product.total_price_usd && product.total_price ? 
                                                                    Number(product.total_price) / Number(product.total_price_usd) : 0
                                                                ).toLocaleString('es-UY', {
                                                                    style: 'currency',
                                                                    currency: 'UYU'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Lots Section */}
                                {register.lots.length > 0 && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-zinc-600">
                                            <i className="fa-solid fa-layer-group text-sm" />
                                            <span className="text-sm font-medium">
                                                Lotes aplicados:
                                            </span>
                                        </div>

                                        <div className="flex gap-2 items-center flex-wrap">
                                            {register.lots.map((lot) => (
                                                <div 
                                                    key={lot.rowid}
                                                    className="inline-flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100  transition-colors"
                                                >
                                                    <i className="fa-solid fa-map-pin text-emerald-500 text-xs" />
                                                    <span className="text-sm font-medium text-emerald-700">
                                                        {lot.name}
                                                    </span>
                                                    <span className="text-xs font-medium text-emerald-600 bg-emerald-100/80 px-1.5 py-0.5 rounded-full">
                                                        {lot.area_utilizada} ha
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {/* Total Summary at the bottom */}
                        <div className="mt-6 flex justify-end border-t border-gray-200 pt-4">
                            <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-zinc-500">Costo Total RAF</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-semibold text-zinc-800">
                                        {Number(raf?.reduce((acc, register) => 
                                            acc + register.products.reduce((prodAcc, product) => 
                                                prodAcc + (Number(product.total_price) || 0), 0
                                            ), 0) || 0
                                        ).toLocaleString('es-UY', {
                                            style: 'currency',
                                            currency: 'UYU'
                                        })}
                                    </span>
                                    <span className="text-base font-medium text-zinc-500">
                                        ({Number(raf?.reduce((acc, register) => 
                                            acc + register.products.reduce((prodAcc, product) => 
                                                prodAcc + (Number(product.total_price_usd) || 0), 0
                                            ), 0) || 0
                                        ).toLocaleString('es-UY', {
                                            style: 'currency',
                                            currency: 'USD'
                                        })})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-zinc-50/50 rounded-lg border border-dashed border-zinc-200">
                        <i className="fa-solid fa-clipboard-list text-zinc-300 text-4xl mb-3" />
                        <p className="text-zinc-500">
                            No hay registros de aplicación fitosanitaria para este cultivo
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};