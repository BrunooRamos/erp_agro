import dayjs from "dayjs";
import { MaintenanceCostCenter } from "../../../interfaces/cost-center.interface";
import { useState } from "react";

interface MaintenanceCCProps {
    data: MaintenanceCostCenter[];
}

export const MaintenanceCC = ({ data }: MaintenanceCCProps) => {
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
                    <i className="fas fa-tools text-blue-500 mr-3"></i>
                    Mantenimiento
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
                                        {item.machinery.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500 mt-2">
                                        <span className="flex items-center">
                                            <i className="far fa-calendar mr-2"></i>
                                            {dayjs(item.date).format("DD/MM/YYYY")}
                                        </span>
                                        <span className="flex items-center">
                                            <i className="fas fa-hashtag mr-2"></i>
                                            {item.machinery.code}
                                        </span>
                                    </div>
                                    <p className="text-sm text-zinc-600 mt-2">
                                        {item.general_description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-zinc-800">
                                        ${formatNumber(item.total_cost)}
                                    </p>
                                    <p className="text-sm text-zinc-500 mt-1">
                                        {item.task}
                                    </p>
                                </div>
                            </div>

                            {/* Products */}
                            {item.products && item.products.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-medium text-zinc-700 mb-2 uppercase tracking-wider">
                                        <i className="fas fa-boxes mr-2"></i>
                                        Productos
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        {item.products.map((product) => (
                                            <div key={product.id} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                                                <p className="text-sm font-medium text-zinc-800">{product.label}</p>
                                                <p className="text-xs text-zinc-500 mt-1">
                                                    {formatNumber(product.quantity)} x ${formatNumber(product.price)}
                                                </p>
                                                <p className="text-sm font-semibold text-zinc-800 mt-1">
                                                    ${formatNumber(product.total_price_usd)}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Other Expenses */}
                            {item.other_expenses > 0 && (
                                <div className="mt-4">
                                    <h4 className="text-xs font-medium text-zinc-700 mb-2 uppercase tracking-wider">
                                        <i className="fas fa-receipt mr-2"></i>
                                        Otros Gastos
                                    </h4>
                                    <div className="bg-gray-50 rounded-lg p-3 shadow-sm">
                                        <p className="text-sm text-zinc-600">{item.expenses_description}</p>
                                        <p className="text-sm font-semibold text-zinc-800 mt-1">
                                            ${formatNumber(item.other_expenses)}
                                        </p>
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