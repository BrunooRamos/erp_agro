import dayjs from "dayjs";
import { FertirriegoCostCenter } from "../../../interfaces/cost-center.interface";
import { useState } from "react";

interface FertirriegoCCProps {
    data: FertirriegoCostCenter[];
}

export const FertirriegoCC = ({ data }: FertirriegoCCProps) => {
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
                    <i className="fas fa-fill-drip text-purple-500 mr-3"></i>
                    Fertirriego
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
                            {/* Header Section */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-base font-semibold text-zinc-800">
                                        Fertirriego - {item.crop_code}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500 mt-2">
                                        <span className="flex items-center">
                                            <i className="far fa-calendar mr-2"></i>
                                            {dayjs(item.date).format("DD/MM/YYYY")}
                                        </span>
                                        <span className="flex items-center">
                                            <i className="fas fa-ruler-combined mr-2"></i>
                                            {formatNumber(item.total_area)} ha
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-zinc-800">
                                        ${formatNumber(item.total_cost)}
                                    </p>
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column - Materiales */}
                                {item.products && item.products.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                            <i className="fas fa-boxes mr-2 text-teal-500"></i>
                                            Materiales
                                        </h4>
                                        <div className="space-y-3">
                                            {item.products.map((product, index) => (
                                                <div key={index} className="flex justify-between items-center">
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

                                {/* Right Column - Lotes */}
                                {item.lots && item.lots.length > 0 && (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-3 flex items-center">
                                            <i className="fas fa-map-marked-alt mr-2 text-red-500"></i>
                                            Lotes
                                        </h4>
                                        <div className="space-y-3">
                                            {item.lots.map((lot) => (
                                                <div key={lot.id} className="flex justify-between items-center">
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
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 