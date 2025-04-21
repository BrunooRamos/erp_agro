import dayjs from "dayjs";
import { LogisticCostsCenter } from "../../../interfaces/cost-center.interface";
import { useState } from "react";

interface LogisticCCProps {
    data: LogisticCostsCenter[];
}

export const LogisticCC = ({ data }: LogisticCCProps) => {
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
                    <i className="fas fa-truck text-orange-500 mr-3"></i>
                    Costos Logísticos
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
                <div className="p-6">
                    {data.map((item) => (
                        <div key={item.id} className="mb-6 last:mb-0">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-zinc-500">Fecha</p>
                                    <p className="font-medium text-zinc-700">
                                        {dayjs(item.date).format("DD/MM/YYYY")}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-500">Tipo</p>
                                    <p className="font-medium text-zinc-700">
                                        {item.type === 'internal' ? 'Movimiento Interno' : 'Movimiento de Campo'}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-zinc-500">Producto</p>
                                    <p className="font-medium text-zinc-700">
                                        {item.product.label || 'No especificado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Cantidad</p>
                                    <p className="font-medium text-zinc-700">
                                        {formatNumber(item.quantity)} unidades
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-zinc-500">Origen</p>
                                    <p className="font-medium text-zinc-700">
                                        {item.origin_warehouse ? item.origin_warehouse.label : 'No especificado'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Destino</p>
                                    <p className="font-medium text-zinc-700">
                                        {item.destination_warehouse.label}
                                    </p>
                                </div>
                            </div>

                            {item.crop_code && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-zinc-500">Código</p>
                                        <p className="font-medium text-zinc-700">
                                            {item.crop_code}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {item.harvest_details && (
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-sm text-zinc-500">Lote</p>
                                        <p className="font-medium text-zinc-700">
                                            {item.harvest_details.lot}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-zinc-500">Variedad</p>
                                        <p className="font-medium text-zinc-700">
                                            {item.harvest_details.variety}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                <div>
                                    <p className="text-sm text-zinc-500">Código de Inventario</p>
                                    <p className="font-medium text-zinc-700">
                                        {item.inventory_code || 'No especificado'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-500">Costo Logístico</p>
                                    <p className="text-lg font-semibold text-zinc-800">
                                        ${formatNumber(item.logistic_cost)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}; 