import { useState, useMemo } from "react";
import { useCrop } from "../../../../hooks";
import { useMovement } from "../../../../hooks/movements/useMovement";

const LoadingSkeleton = () => (
    <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 animate-pulse">
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <div className="space-y-2">
                            <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            <div className="h-6 w-32 bg-gray-200 rounded"></div>
                        </div>
                        <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                                <div className="h-4 w-24 bg-gray-200 rounded"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        ))}
    </div>
);

export const ListPotateoHarvest = () => {
    const { listCrop } = useCrop();
    const { data: crops = [], isLoading: isLoadingCrops } = listCrop;
    
    const [selectedCropCode, setSelectedCropCode] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("all");
    const [searchCropCode, setSearchCropCode] = useState<string>("");
    const { listPotateoHarvest } = useMovement(searchCropCode);
    const { data: harvests = [], isLoading: isLoadingHarvests } = listPotateoHarvest;

    const handleSearch = () => {
        setSearchCropCode(selectedCropCode);
    };

    const sortedHarvests = useMemo(() => {
        const filtered = selectedType === "all" 
            ? harvests 
            : harvests.filter(h => h.type === selectedType);
        
        return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [harvests, selectedType]);

    const metrics = useMemo(() => {
        const totalBins = harvests.reduce((sum, h) => sum + h.quantity, 0);
        const semillaBins = harvests.filter(h => h.type === 'semilla').reduce((sum, h) => sum + h.quantity, 0);
        const consumoBins = harvests.filter(h => h.type === 'consumo').reduce((sum, h) => sum + h.quantity, 0);
        
        return {
            totalBins,
            semillaBins,
            consumoBins
        };
    }, [harvests]);
    
    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-2">Historial de Cosecha de Papa</h1>
                <p className="text-gray-600">Seleccione un cultivo para ver su historial de cosecha</p>
            </div>

            <div className="mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="crop-select" className="block text-sm font-medium text-gray-700 mb-2">
                            Seleccionar Cultivo
                        </label>
                        <select
                            id="crop-select"
                            value={selectedCropCode}
                            onChange={(e) => setSelectedCropCode(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={isLoadingCrops}
                        >
                            <option value="">Seleccione un cultivo</option>
                            {crops.map((crop) => (
                                <option key={crop.code} value={crop.code}>
                                    {crop.cultivo} - {crop.code}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-2">
                            Filtrar por Tipo
                        </label>
                        <select
                            id="type-filter"
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={!selectedCropCode}
                        >
                            <option value="all">Todos</option>
                            <option value="semilla">Semilla</option>
                            <option value="consumo">Consumo</option>
                        </select>
                    </div>
                </div>
                <div className="flex justify-end">
                    <button
                        onClick={handleSearch}
                        disabled={!selectedCropCode || isLoadingCrops}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 flex items-center gap-2"
                    >
                        <i className="fas fa-search"></i>
                        Buscar
                    </button>
                </div>
            </div>

            {isLoadingCrops && (
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {searchCropCode && (
                <>
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Total de Bins</h3>
                            <p className="text-3xl font-bold text-indigo-600">{metrics.totalBins}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Bins de Semilla</h3>
                            <p className="text-3xl font-bold text-green-600">{metrics.semillaBins}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Bins de Consumo</h3>
                            <p className="text-3xl font-bold text-blue-600">{metrics.consumoBins}</p>
                        </div>
                    </div>

                    {isLoadingHarvests ? (
                        <LoadingSkeleton />
                    ) : (
                        <div className="space-y-4">
                            {sortedHarvests.map((harvest) => (
                                <div key={harvest.id} className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    harvest.type === 'semilla' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    {harvest.type.charAt(0).toUpperCase() + harvest.type.slice(1)}
                                                </span>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(harvest.date).toLocaleDateString('es-ES', {
                                                        day: '2-digit',
                                                        month: '2-digit',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-lg font-semibold text-gray-900">
                                                    {harvest.quantity} bins
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-500">Lote</p>
                                                <p className="text-sm font-medium text-gray-900">{harvest.lot_info.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Sublote</p>
                                                <p className="text-sm font-medium text-gray-900">{harvest.sublote?.name || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Variedad</p>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {harvest.variety.name} ({harvest.variety.code})
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500">Almacén</p>
                                                <p className="text-sm font-medium text-gray-900">{harvest.warehouse.ref}</p>
                                            </div>
                                        </div>

                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-gray-500">Área:</span>
                                                    <span className="font-medium">{harvest.lot_info.area.real.toFixed(2)} ha</span>
                                                </div>
                                                {harvest.logistics && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-gray-500">Costo:</span>
                                                        <span className="font-medium">${harvest.logistics.cost.toFixed(2)}</span>
                                                        <span className="text-gray-400 text-xs">({harvest.logistics.kilometers} km)</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};