import { useState } from "react";
import dayjs from "dayjs";
import { IrrigationCostCenter } from "../../../interfaces/cost-center.interface";

interface IrrigationCCProps {
    data: IrrigationCostCenter[];
}

export const IrrigationCC = ({ data }: IrrigationCCProps) => {
    const [showTimeline, setShowTimeline] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);

    const formatNumber = (value: string | number) => {
        const num = typeof value === 'string' ? parseFloat(value) : value;
        return isNaN(num) ? '0.00' : num.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    if (!data?.length) return null;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-zinc-800 flex items-center">
                    <i className="fas fa-water text-blue-500 mr-3"></i>
                    Irrigación
                </h2>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-zinc-500 hover:text-zinc-700 transition-colors"
                    title={isExpanded ? "Contraer" : "Expandir"}
                >
                    <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-lg`}></i>
                </button>
            </div>
            {isExpanded && (
                <div className="divide-y divide-gray-100">
                    {data.map((item) => (
                        <div key={`irrigation-${item.id}`} className="p-6">
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-800">
                                        {item.name || 'Irrigación'} - {item.crop_code}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500 mt-2">
                                        <span className="flex items-center">
                                            <i className="far fa-calendar mr-2"></i>
                                            {dayjs(item.date).format("DD/MM/YYYY")}
                                        </span>
                                        <span className="flex items-center">
                                            <i className="fas fa-clock mr-2"></i>
                                            {formatNumber(item.total_hours)} horas
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-zinc-800">
                                        ${formatNumber(item.total_cost)}
                                    </p>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        {formatNumber(item.total_area)} ha
                                    </p>
                                </div>
                            </div>

                            {/* Timeline Toggle Button */}
                            <div className="mb-4">
                                <button
                                    onClick={() => setShowTimeline(!showTimeline)}
                                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                >
                                    <i className={`fas fa-chevron-${showTimeline ? 'up' : 'down'} mr-1`}></i>
                                    {showTimeline ? 'Ocultar' : 'Mostrar'} línea de tiempo
                                </button>
                            </div>

                            {/* Timeline Section */}
                            {showTimeline && (
                                <div className="mb-6">
                                    <h4 className="text-sm font-medium text-zinc-700 mb-4 flex items-center">
                                        <i className="fas fa-history mr-2 text-blue-500"></i>
                                        Horas de Riego
                                    </h4>
                                    <div className="relative">
                                        {/* Timeline Line */}
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                                        
                                        {/* Timeline Items */}
                                        <div className="space-y-6">
                                            {item.irrigation_hours?.map((hour) => (
                                                <div key={`hour-${hour.id}`} className="relative pl-12">
                                                    {/* Timeline Dot */}
                                                    <div className="absolute left-3 w-3 h-3 rounded-full bg-blue-500 border-2 border-white shadow-sm"></div>
                                                    
                                                    {/* Timeline Content */}
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <div className="flex flex-col">
                                                            <div className="mb-3">
                                                                <p className="text-base font-medium text-zinc-800 mb-2">
                                                                    {dayjs(hour.date).format("DD/MM/YYYY")}
                                                                </p>
                                                                <div className="flex items-center gap-6">
                                                                    <span className="flex items-center text-sm text-zinc-600">
                                                                        <i className="far fa-clock mr-2 text-zinc-400"></i>
                                                                        {formatNumber(hour.hours)} horas
                                                                    </span>
                                                                    <span className="flex items-center text-sm text-zinc-600">
                                                                        <i className="fas fa-gas-pump mr-2 text-zinc-400"></i>
                                                                        ${formatNumber(hour.fuel_cost_usd)}
                                                                    </span>
                                                                    <span className="flex items-center text-sm text-zinc-600">
                                                                        <i className="fas fa-tools mr-2 text-zinc-400"></i>
                                                                        ${formatNumber(hour.maintenance_cost_usd)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Lots for this hour */}
                                                            {hour.lots && hour.lots.length > 0 && (
                                                                <div className="pt-3 border-t border-gray-200">
                                                                    <div className="flex items-center gap-4">
                                                                        <h5 className="text-sm font-medium text-zinc-400">Lotes:</h5>
                                                                        <div className="flex items-center gap-6">
                                                                            {hour.lots.map((lot) => (
                                                                                <div key={`hour-lot-${lot.id}`} className="flex items-center gap-2">
                                                                                    <span className="text-base font-medium text-zinc-800">
                                                                                        {lot.name}
                                                                                    </span>
                                                                                    <span className="text-sm text-zinc-500">
                                                                                        ({formatNumber(lot.area)} ha)
                                                                                    </span>
                                                                                    {lot.sublot && (
                                                                                        <span className="text-sm text-zinc-500 flex items-center">
                                                                                            <i className="fas fa-layer-group mx-1 text-zinc-400"></i>
                                                                                            {lot.sublot.name}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Costs */}
                                <div className="space-y-6">
                                    {/* Linea Madre */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                            <i className="fas fa-water mr-2 text-blue-500"></i>
                                            Línea Madre
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-zinc-500">Costo Total</p>
                                                <p className="text-lg font-semibold text-blue-800">${formatNumber(item.cost_mother_line)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Metros</p>
                                                <p className="text-lg font-semibold text-blue-800">{formatNumber(item.meters_of_line_mother)} m</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mantenimiento */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                            <i className="fas fa-tools mr-2 text-green-500"></i>
                                            Mantenimiento
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-xs text-zinc-500">Costo Total</p>
                                                <p className="text-lg font-semibold text-green-800">${formatNumber(item.maintenance_cost_usd)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Horas Total</p>
                                                <p className="text-lg font-semibold text-green-800">{formatNumber(item.total_hours)} hrs</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Combustible */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                            <i className="fas fa-gas-pump mr-2 text-yellow-500"></i>
                                            Combustible
                                        </h4>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-zinc-500">Costo Total</p>
                                                <p className="text-lg font-semibold text-yellow-800">${formatNumber(item.fuel_cost_usd)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Horas Total</p>
                                                <p className="text-lg font-semibold text-yellow-800">{formatNumber(item.total_hours)} hrs</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Consumo</p>
                                                <p className="text-lg font-semibold text-yellow-800">{formatNumber(item.fuel_consumption_per_hour)} L/hr</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column - Details */}
                                <div className="space-y-6">
                                    {/* Equipos */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                            <i className="fas fa-cogs mr-2 text-purple-500"></i>
                                            Equipos
                                        </h4>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-xs text-zinc-500">Primer Equipo</p>
                                                <p className="text-sm font-medium text-zinc-800">{item.first_equipment || 'No especificado'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Segundo Equipo</p>
                                                <p className="text-sm font-medium text-zinc-800">{item.second_equipment || 'No especificado'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Productos */}
                                    {item.products && item.products.length > 0 && (
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                                <i className="fas fa-boxes mr-2 text-indigo-500"></i>
                                                Materiales
                                            </h4>
                                            <div className="space-y-3">
                                                {item.products.map((product) => (
                                                    <div key={`product-${product.product_name}-${product.quantity}`} className="flex justify-between items-center">
                                                        <div>
                                                            <p className="text-sm font-medium text-zinc-800">{product.product_name}</p>
                                                            <p className="text-xs text-zinc-500">{product.quantity} {product.unit || "u"}</p>
                                                        </div>
                                                        <p className="text-sm font-semibold text-zinc-700">
                                                            ${formatNumber(product.total_price)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Lotes Totales */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                            <i className="fas fa-map-marked-alt mr-2 text-red-500"></i>
                                            Lotes Totales
                                        </h4>
                                        <div className="space-y-3">
                                            {item.lots?.map((lot) => (
                                                <div key={`lot-${lot.id}`} className="flex justify-between items-center">
                                                    <div>
                                                        <p className="text-sm font-medium text-zinc-800">{lot.name}</p>
                                                        <p className="text-xs text-zinc-500">{formatNumber(lot.area)} ha</p>
                                                        {lot.sublot && (
                                                            <p className="text-xs text-zinc-500 flex items-center">
                                                                <i className="fas fa-layer-group mr-1"></i>
                                                                {lot.sublot.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 