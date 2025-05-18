import { useIrrigation } from "../../../../hooks/";
import { IrrigationCard } from "../../../../ui/components";
import { useState, useMemo } from "react";

export const IrrigationList = () => {
    const { irrigationList } = useIrrigation();
    const [selectedCropCode, setSelectedCropCode] = useState<string>('all');

    console.log(JSON.stringify(irrigationList.data, null, 2));

    // Obtener códigos de cultivo únicos
    const uniqueCropCodes = useMemo(() => {
        if (!irrigationList.data) return [];
        return Array.from(new Set(irrigationList.data.map(irrigation => irrigation.crop_code)));
    }, [irrigationList.data]);

    // Filtrar la lista según el código de cultivo seleccionado
    const filteredIrrigationList = useMemo(() => {
        if (!irrigationList.data) return [];
        if (selectedCropCode === 'all') return irrigationList.data;
        return irrigationList.data.filter(irrigation => irrigation.crop_code === selectedCropCode);
    }, [irrigationList.data, selectedCropCode]);

    if (irrigationList.isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }
    
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-zinc-900">Lista de Riegos</h1>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredIrrigationList.map((irrigation) => (
                    <IrrigationCard 
                        key={irrigation.rowid} 
                        data={irrigation}
                    />
                ))}
            </div>

            {(!filteredIrrigationList || filteredIrrigationList.length === 0) && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <i className="fa-solid fa-water text-gray-300 text-4xl mb-3" />
                    <p className="text-gray-500">No hay registros de riego disponibles</p>
                </div>
            )}
        </div>
    );
};