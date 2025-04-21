import { GetCostCenter } from "../../../interfaces/cost-center.interface";
import { useState } from "react";

interface CostBreakdownProps {
    data: GetCostCenter;
}

export const CostBreakdown = ({ data }: CostBreakdownProps) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        labors: false,
        rafs: false,
        seed_maps: false,
        irrigations: false,
        fertirriego: false,
        wash_processes: false,
        tong_processes: false,
        logistic_costs: false,
        maintenance_costs: false,
        other_expenses: false
    });

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-800 flex items-center">
                    <i className="fas fa-chart-pie mr-3 text-zinc-600"></i>
                    Desglose de Costos
                </h2>
            </div>
            <div className="p-6">
                {/* Total General */}
                <div className="flex items-center justify-between py-4 border-b-2 border-zinc-800">
                    <div className="flex items-center">
                        <span className="text-xl font-bold text-zinc-800">Total General</span>
                    </div>
                    <span className="text-xl font-bold text-zinc-800">
                        ${data?.grand_total?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                    </span>
                </div>

                {/* Categorías Principales */}
                <div className="mt-4 space-y-4">
                    {/* Labores */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('labors')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.labors ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-tractor text-blue-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">Labores</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.labors / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.labors?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.labors && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-users text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Labor</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.labors?.reduce((sum, labor) => sum + labor.labor_cost, 0) / data?.totals?.labors) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.labors?.reduce((sum, labor) => sum + labor.labor_cost, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Combustible</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.labors?.reduce((sum, labor) => sum + labor.fuel_cost_usd, 0) / data?.totals?.labors) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.labors?.reduce((sum, labor) => sum + labor.fuel_cost_usd, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RAFs */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('rafs')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.rafs ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-spray-can text-green-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">RAFs</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.rafs / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.rafs?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.rafs && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-users text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Labor</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.rafs?.reduce((sum, raf) => sum + raf.labor_cost, 0) / data?.totals?.rafs) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.rafs?.reduce((sum, raf) => sum + raf.labor_cost, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Combustible</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.rafs?.reduce((sum, raf) => sum + raf.fuel_cost_usd, 0) / data?.totals?.rafs) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.rafs?.reduce((sum, raf) => sum + raf.fuel_cost_usd, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Productos</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.rafs?.reduce((sum, raf) => sum + raf.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / data?.totals?.rafs) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.rafs?.reduce((sum, raf) => sum + raf.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Siembras */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('seed_maps')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.seed_maps ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-seedling text-yellow-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">Siembras</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.seed_maps / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.seed_maps?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.seed_maps && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-users text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Labor</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.seed_maps?.reduce((sum, seed) => sum + seed.labor_cost, 0) / data?.totals?.seed_maps) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.seed_maps?.reduce((sum, seed) => sum + seed.labor_cost, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Combustible</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.seed_maps?.reduce((sum, seed) => sum + seed.fuel_cost_usd, 0) / data?.totals?.seed_maps) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.seed_maps?.reduce((sum, seed) => sum + seed.fuel_cost_usd, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Productos</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.seed_maps?.reduce((sum, seed) => sum + seed.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / data?.totals?.seed_maps) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.seed_maps?.reduce((sum, seed) => sum + seed.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Irrigaciones */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('irrigations')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.irrigations ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-water text-blue-400 mr-3"></i>
                                <span className="font-medium text-zinc-700">Irrigaciones</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.irrigation / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.irrigation?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.irrigations && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-tint text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Línea Madre</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.cost_mother_line, 0) / data?.totals?.irrigation) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.cost_mother_line, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-tools text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Mantenimiento</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.maintenance_cost_usd, 0) / data?.totals?.irrigation) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.maintenance_cost_usd, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Combustible</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.fuel_cost_usd, 0) / data?.totals?.irrigation) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.fuel_cost_usd, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Productos</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / data?.totals?.irrigation) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.irrigations?.reduce((sum, irr) => sum + irr.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Fertirriego */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('fertirriego')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.fertirriego ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-fill-drip text-purple-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">Fertirriego</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.fertirriego / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.fertirriego?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.fertirriego && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Productos</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.fertirriego?.reduce((sum, fert) => sum + fert.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / data?.totals?.fertirriego) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.fertirriego?.reduce((sum, fert) => sum + fert.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Proceso de Lavado */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('wash_processes')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.wash_processes ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-water text-blue-400 mr-3"></i>
                                <span className="font-medium text-zinc-700">Proceso de Lavado</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.wash_processes / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.wash_processes?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.wash_processes && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Costo Total</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">100%</span>
                                        <span className="text-zinc-600">
                                            ${data?.totals?.wash_processes?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Proceso de Tong */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('tong_processes')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.tong_processes ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-box text-orange-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">Proceso de Tong</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.tong_processes / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.tong_processes?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.tong_processes && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Costo Total</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">100%</span>
                                        <span className="text-zinc-600">
                                            ${data?.totals?.tong_processes?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Costos Logísticos */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('logistic_costs')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.logistic_costs ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-truck text-orange-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">Costos Logísticos</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.logistic_costs / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.logistic_costs?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.logistic_costs && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Costo Total</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">100%</span>
                                        <span className="text-zinc-600">
                                            ${data?.totals?.logistic_costs?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mantenimiento */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('maintenance_costs')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.maintenance_costs ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-tools text-blue-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">Mantenimiento</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.maintenance_costs / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.maintenance_costs?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.maintenance_costs && (
                            <div className="pl-8 mt-2 space-y-2">
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-box text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Productos</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.maintenance_costs?.reduce((sum, maint) => sum + maint.products.reduce((pSum, product) => pSum + product.total_price_usd, 0), 0) / data?.totals?.maintenance_costs) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.maintenance_costs?.reduce((sum, maint) => sum + maint.products.reduce((pSum, product) => pSum + product.total_price_usd, 0), 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-1">
                                    <div className="flex items-center">
                                        <i className="fas fa-receipt text-zinc-400 mr-2"></i>
                                        <span className="text-zinc-600">Otros Gastos</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-zinc-500">
                                            {((data?.expenses?.maintenance_costs?.reduce((sum, maint) => sum + maint.other_expenses, 0) / data?.totals?.maintenance_costs) * 100).toFixed(1)}%
                                        </span>
                                        <span className="text-zinc-600">
                                            ${data?.expenses?.maintenance_costs?.reduce((sum, maint) => sum + maint.other_expenses, 0)?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Otros Gastos */}
                    <div className="pl-4">
                        <div 
                            className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                            onClick={() => toggleSection('other_expenses')}
                        >
                            <div className="flex items-center">
                                <i className={`fas fa-chevron-${expandedSections.other_expenses ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                <i className="fas fa-receipt text-purple-500 mr-3"></i>
                                <span className="font-medium text-zinc-700">Otros Gastos</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-zinc-500">
                                    {((data?.totals?.other_expenses / data?.grand_total) * 100).toFixed(1)}%
                                </span>
                                <span className="font-medium text-zinc-700">
                                    ${data?.totals?.other_expenses?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                </span>
                            </div>
                        </div>
                        {expandedSections.other_expenses && (
                            <div className="pl-8 mt-2 space-y-2">
                                {data?.expenses?.other_expenses?.map((expense, index) => (
                                    <div key={index} className="flex items-center justify-between py-1">
                                        <div className="flex items-center">
                                            <i className="fas fa-file-invoice text-zinc-400 mr-2"></i>
                                            <span className="text-zinc-600">{expense.name}</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-zinc-500">
                                                {((expense.total_cost / data?.totals?.other_expenses) * 100).toFixed(1)}%
                                            </span>
                                            <span className="text-zinc-600">
                                                ${expense.total_cost?.toLocaleString('es-PE', { minimumFractionDigits: 2 }) || '0.00'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}; 