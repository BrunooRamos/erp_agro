import { useRegisters } from "../../../../../hooks";
import { useState, useMemo } from "react";

export const ListLabor = () => {
    const { listLabor } = useRegisters();
    const { data: laborList, isLoading, error } = listLabor;
    const [selectedLaborType, setSelectedLaborType] = useState<string>('all');
    const [selectedCropCode, setSelectedCropCode] = useState<string>('all');

    // Obtener tipos de labor únicos
    const uniqueLaborTypes = useMemo(() => {
        if (!laborList) return [];
        return Array.from(new Set(laborList.map(labor => labor.cusa_info.cod_laboreo)));
    }, [laborList]);

    // Obtener códigos de cultivo únicos
    const uniqueCropCodes = useMemo(() => {
        if (!laborList) return [];
        return Array.from(new Set(laborList.map(labor => labor.crop_code)));
    }, [laborList]);

    // Filtrar la lista según el tipo de labor y cultivo seleccionado
    const filteredLaborList = useMemo(() => {
        if (!laborList) return [];
        return laborList.filter(labor => {
            const matchesLaborType = selectedLaborType === 'all' || labor.cusa_info.cod_laboreo === selectedLaborType;
            const matchesCropCode = selectedCropCode === 'all' || labor.crop_code === selectedCropCode;
            return matchesLaborType && matchesCropCode;
        });
    }, [laborList, selectedLaborType, selectedCropCode]);

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
                <div className="flex gap-3">
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
                    <select 
                        title="Filtrar por cultivo"
                        value={selectedCropCode}
                        onChange={(e) => setSelectedCropCode(e.target.value)}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="all">Todos los cultivos</option>
                        {uniqueCropCodes.map(code => (
                            <option key={code} value={code}>{code}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredLaborList.map((labor) => (
                    <div 
                        key={labor.rowid}
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
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-zinc-900">
                                                {labor.cusa_info.laboreo}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs font-medium">
                                                {labor.crop_code}
                                            </span>
                                        </div>
                                        <p className="text-sm text-zinc-500">
                                            <i className="fa-regular fa-calendar-days mr-1" />
                                            {new Date(labor.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-zinc-600">
                                            <i className="fa-solid fa-gas-pump mr-1 text-amber-500"></i>
                                            Combustible: {(labor.selectedSublots.reduce((sum, sublot) => sum + sublot.area_utilizada, 0) * labor.cusa_info.lts_ha).toFixed(2)} lts
                                        </span>
                                        <span className="text-sm text-zinc-600">
                                            <i className="fa-solid fa-chart-area mr-1 text-emerald-500"></i>
                                            Área total: {labor.selectedSublots.reduce((sum, sublot) => sum + sublot.area_utilizada, 0)} ha
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Machinery Info */}
                        {labor.machinaryUsed.length > 0 && (
                            <div className="p-4 border-b border-gray-100">
                                <h4 className="text-sm font-medium text-zinc-500 mb-3">Maquinaria Utilizada</h4>
                                <div className="flex flex-wrap gap-2">
                                    {labor.machinaryUsed.map((machine) => (
                                        <span 
                                            key={machine.rowid}
                                            className="inline-flex items-center px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700"
                                        >
                                            <i className="fa-solid fa-tractor mr-2 text-zinc-400"></i>
                                            {machine.name} • {machine.brand} {machine.model}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Lots */}
                        <div className="p-4 bg-gray-50 rounded-b-lg">
                            <h4 className="text-sm font-medium text-zinc-500 mb-3">Lotes Afectados</h4>
                            <div className="flex flex-col gap-3">
                                {labor.selectedLots.map((lot) => (
                                    <div 
                                        key={lot.rowid}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-l-full text-sm text-zinc-600">
                                            {lot.name} - {lot.campo_name} ({lot.area_utilizada} ha)
                                        </span>
                                        {labor.selectedSublots
                                            .filter(sublot => sublot.id_parent_lote === lot.rowid)
                                            .length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <span className="w-5 h-[1px] bg-gray-200"></span>
                                                <div className="flex flex-wrap gap-2">
                                                    {labor.selectedSublots
                                                        .filter(sublot => sublot.id_parent_lote === lot.rowid)
                                                        .map(sublot => (
                                                            <span 
                                                                key={sublot.id_sub_lote}
                                                                className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs text-emerald-600"
                                                            >
                                                                {sublot.name} ({sublot.area_utilizada} ha)
                                                            </span>
                                                        ))
                                                    }
                                                </div>
                                            </div>
                                        )}
                                    </div>
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