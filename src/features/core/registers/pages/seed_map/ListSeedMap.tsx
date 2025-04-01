import { useRegisters } from "../../../../../hooks";
import { useState, useMemo } from "react";

export const ListSeedMap = () => {
    const { listSeedMap } = useRegisters();
    const { data: seedMapList, isLoading, error } = listSeedMap;
    const [selectedCropCode, setSelectedCropCode] = useState<string>('all');

    // Obtener códigos de cultivo únicos
    const uniqueCropCodes = useMemo(() => {
        if (!seedMapList) return [];
        return Array.from(new Set(seedMapList.map(register => register.seed_map.crop_code)));
    }, [seedMapList]);

    // Filtrar la lista según el código de cultivo seleccionado
    const filteredSeedMapList = useMemo(() => {
        if (!seedMapList) return [];
        if (selectedCropCode === 'all') return seedMapList;
        return seedMapList.filter(register => register.seed_map.crop_code === selectedCropCode);
    }, [seedMapList, selectedCropCode]);

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
                <h1 className="text-2xl font-bold text-zinc-900">Registros de Siembra</h1>
                <select 
                    title="Filtrar por código de cultivo"
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

            <div className="grid gap-4">
                {filteredSeedMapList.map((register) => (
                    <div 
                        key={register.seed_map.rowid}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <i className="fa-solid fa-seedling text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-zinc-900">
                                            Siembra
                                        </h3>
                                        <p className="text-sm text-zinc-500">
                                            <i className="fa-regular fa-calendar-days mr-1" />
                                            {new Date(register.seed_map.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm rounded-full">
                                        {register.seed_map.crop_code}
                                    </span>
                                    {register.seed_map.grooves && (
                                        <span className="text-sm text-zinc-500">
                                            Surcos: {register.seed_map.grooves}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Products */}
                        <div className="p-4">
                            <h4 className="text-sm font-medium text-zinc-500 mb-3">Productos Utilizados</h4>
                            <div className="space-y-3">
                                {register.products.map((product) => (
                                    <div 
                                        key={product.rowid}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-zinc-800">{product.product_name}</p>
                                            <p className="text-sm text-zinc-500">
                                                {product.warehouse_name} - {product.tipo_presentacion}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-zinc-800">
                                                {product.stock_used} {product.medida}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lots */}
                        <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
                            <h4 className="text-sm font-medium text-zinc-500 mb-3">Lotes Afectados</h4>
                            <div className="flex flex-wrap gap-2">
                                {register.lots.map((lot) => (
                                    <div 
                                        key={lot.rowid}
                                        className="inline-flex items-center gap-2"
                                    >
                                        <span className="px-3 py-1 bg-white border border-gray-200 rounded-l-full text-sm text-zinc-600">
                                            {lot.name} ({lot.area_total} ha)
                                        </span>
                                        {lot.sublots && lot.sublots.length > 0 && (
                                            <div className="flex items-center gap-1">
                                                <span className="w-5 h-[1px] bg-gray-200"></span>
                                                {lot.sublots.map((sublot) => (
                                                    <span 
                                                        key={sublot.id}
                                                        className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-xs text-emerald-600"
                                                    >
                                                        {sublot.name} ({sublot.area_utilizada} ha)
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {(!filteredSeedMapList || filteredSeedMapList.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <i className="fa-solid fa-seedling text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500">No hay registros de siembra</p>
                    </div>
                )}
            </div>
        </div>
    );
};