import dayjs from "dayjs";
import { RafCostCenter } from "../../../interfaces/cost-center.interface";
import { useState } from "react";

interface RafCCProps {
    data: RafCostCenter[];
}

export const RafCC = ({ data }: RafCCProps) => {
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
                    <i className="fas fa-spray-can text-green-500 mr-3"></i>
                    RAFs
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
                        <div key={item.id} className="p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-800">
                                        {item.type} - {item.sub_type}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500 mt-2">
                                        <span className="flex items-center">
                                            <i className="far fa-calendar mr-2"></i>
                                            {dayjs(item.date).format("DD/MM/YYYY")}
                                        </span>
                                        <span className="flex items-center">
                                            <i className="fas fa-hashtag mr-2"></i>
                                            {item.cusa_code}
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

                            {/* Cost Details */}
                            <div className="grid grid-cols-3 gap-4 mt-3">
                                <div className="bg-blue-50 rounded-lg p-3 shadow-sm">
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">CUSA</p>
                                    <p className="text-lg font-semibold text-blue-800 mt-1">${formatNumber(item.cusa_cost)}</p>
                                </div>
                                <div className="bg-green-50 rounded-lg p-3 shadow-sm">
                                    <p className="text-xs font-medium text-green-600 uppercase tracking-wider">Labor</p>
                                    <p className="text-lg font-semibold text-green-800 mt-1">${formatNumber(item.labor_cost)}</p>
                                </div>
                                <div className="bg-yellow-50 rounded-lg p-3 shadow-sm">
                                    <p className="text-xs font-medium text-yellow-600 uppercase tracking-wider">Combustible</p>
                                    <div className="mt-1">
                                        <p className="text-sm text-yellow-700">
                                            {formatNumber(item.fuel_liters)}L @ ${formatNumber(item.fuel_price)}/L
                                        </p>
                                        <p className="text-lg font-semibold text-yellow-800">
                                            ${formatNumber(item.fuel_cost_usd)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Products */}
                            {item.products && item.products.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-medium text-zinc-700 mb-2 uppercase tracking-wider">
                                        <i className="fas fa-boxes mr-2"></i>
                                        Productos
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {item.products.map((product, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                                                <p className="text-sm font-medium text-zinc-800">
                                                    {product.product_name}
                                                </p>
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    {product.quantity} {product.unit || "u"}
                                                </p>
                                                <p className="text-sm font-semibold text-zinc-700 mt-1">
                                                    ${formatNumber(product.total_price)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Lots */}
                            {item.lots && item.lots.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-medium text-zinc-700 mb-2 uppercase tracking-wider">
                                        <i className="fas fa-map-marked-alt mr-2"></i>
                                        Lotes
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3">
                                        {item.lots.map((lot) => (
                                            <div key={lot.id} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                                                <p className="text-sm font-medium text-zinc-800">{lot.name}</p>
                                                <p className="text-xs text-zinc-500 mt-1">{formatNumber(lot.area)} ha</p>
                                                {lot.sublot && (
                                                    <p className="text-xs text-zinc-500 mt-1">
                                                        <i className="fas fa-layer-group mr-1"></i>
                                                        {lot.sublot.name}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 