import { WashProcessCostCenter, QualityBagCostCenter } from "../../../interfaces/cost-center.interface";
import { useState } from "react";

interface Props {
    data: WashProcessCostCenter[];
}

export const WashProcessCC = ({ data }: Props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-zinc-800 flex items-center">
                    <i className="fas fa-water text-blue-400 mr-3"></i>
                    Proceso de Lavado
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
                    {data.map((process) => (
                        <div key={process.id} className="mb-6 last:mb-0">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <p className="text-sm text-zinc-500">Fecha</p>
                                    <p className="font-medium text-zinc-700">
                                        {new Date(process.date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-500">Cultivo</p>
                                    <p className="font-medium text-zinc-700">{process.crop_code}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-zinc-500">Papa Origen</p>
                                    <p className="font-medium text-zinc-700">
                                        {process.parent_potato.label || process.parent_potato.ref}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Papa Destino</p>
                                    <p className="font-medium text-zinc-700">
                                        {process.potato.label || process.potato.ref}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-zinc-500">Número de Bines</p>
                                    <p className="font-medium text-zinc-700">{process.process_details.number_of_bins}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-zinc-500">Mermas</p>
                                    <p className="font-medium text-zinc-700">{process.process_details.mermas}%</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-zinc-500 mb-2">Bolsas por Calidad</p>
                                <div className="grid grid-cols-2 gap-4">
                                    {process.process_details.quality_bags.map((bag: QualityBagCostCenter) => (
                                        <div key={bag.quality} className="flex items-center justify-between">
                                            <span className="text-zinc-600">
                                                {bag.quality} {bag.label ? `(${bag.label})` : ''}
                                            </span>
                                            <span className="font-medium text-zinc-700">{bag.bags}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                                <div>
                                    <p className="text-sm text-zinc-500">Total Bolsas</p>
                                    <p className="font-medium text-zinc-700">{process.process_details.total_bags}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-zinc-500">Costo Total</p>
                                    <p className="text-lg font-semibold text-zinc-800">
                                        ${process.total_cost.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
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