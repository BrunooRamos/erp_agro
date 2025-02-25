import { useRegisters } from "../../../../../hooks";
import { useState, useMemo } from "react";

export const ListLabor = () => {
    const { listLabor } = useRegisters();
    const { data: laborList, isLoading, error } = listLabor;
    const [selectedLaborType, setSelectedLaborType] = useState<string>('all');

    console.log(laborList);

    // Obtener tipos de labor únicos
    const uniqueLaborTypes = useMemo(() => {
        if (!laborList) return [];
        return Array.from(new Set(laborList.map(labor => labor.labor_code)));
    }, [laborList]);

    // Filtrar la lista según el tipo de labor seleccionado
    const filteredLaborList = useMemo(() => {
        if (!laborList) return [];
        if (selectedLaborType === 'all') return laborList;
        return laborList.filter(labor => labor.labor_code === selectedLaborType);
    }, [laborList, selectedLaborType]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                Error al cargar los datos: {error.message}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-zinc-900">Registros de Labor</h1>
                <select 
                    title="Filtrar por tipo de labor"
                    value={selectedLaborType}
                    onChange={(e) => setSelectedLaborType(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                    <option value="all">Todas las labores</option>
                    {uniqueLaborTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            <div className="grid gap-4">
                {filteredLaborList.map((labor) => (
                    <div 
                        key={labor.labor_code}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <i className="fa-solid fa-tractor text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-zinc-900">
                                            {labor.labor_code}
                                        </h3>
                                        <p className="text-sm text-zinc-500">
                                            <i className="fa-regular fa-calendar-days mr-1" />
                                            {new Date(labor.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="text-sm font-medium text-emerald-600">
                                        Total: {labor.lts} lts
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Lots */}
                        <div className="p-4 bg-gray-50 rounded-b-lg">
                            <h4 className="text-sm font-medium text-zinc-500 mb-3">Lotes Afectados</h4>
                            <div className="flex flex-wrap gap-2">
                                {labor.selectedLots.map((lot) => (
                                    <span 
                                        key={lot.id_lote}
                                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-zinc-600"
                                    >
                                        {lot.id_lote} ({lot.area_utilizada} ha)
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {(!filteredLaborList || filteredLaborList.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <i className="fa-solid fa-tractor text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500">No hay registros de labor</p>
                    </div>
                )}
            </div>
        </div>
    );
};