import { useState, useEffect } from "react";
import { Control, useWatch, Path } from "react-hook-form";
import { toast } from "react-toastify";
import { useCrop } from "./../index"; // Ajusta la ruta según tu estructura
import { GeneralLabor, IrrigationFertirriegoSendData, IrrigationFormInterface, IrrigationHoursSendData, IrrigationResponse, RAFSendData, SeedMapRegisterInterface, SelectedLot, SelectedSubLot } from "../../interfaces";



export const useCropAndLots = <T extends RAFSendData | SeedMapRegisterInterface | GeneralLabor | IrrigationFormInterface | IrrigationHoursSendData | IrrigationFertirriegoSendData>(
  control: Control<T>,
  initialCropCode?: string,
  irrigationData?: IrrigationResponse
) => {
    // State for selected lots
    const [selectedLots, setSelectedLots] = useState<SelectedLot[]>([]);

    //State for selected sublots
    const [selectedSublots, setSelectedSublots] = useState<SelectedSubLot[]>([]);

    // Get crops
    const { listCrop } = useCrop();
    const { data: crops, isLoading: isLoadingCrops } = listCrop;

    // Watch crop code
    const selectedCropCode = useWatch({ 
        control, 
        name: "crop_id" as Path<T> 
    }) || initialCropCode;
    
    // Get crop rowid
    const selectedCrop = crops?.find(crop => crop.rowid === selectedCropCode);

    // Get lots by crop
    const { getLotsByCropId } = useCrop(selectedCrop?.rowid );
    const { data: lots, isLoading: isLoadingLots } = getLotsByCropId;
    
    // Sort crops by code
    const sortedCrops = crops?.sort((a, b) => a.code.localeCompare(b.code));

    // Initialize selectedLots and selectedSublots with irrigationData if available
    useEffect(() => {
        if (irrigationData && lots) {
            // Pre-select lots from irrigationData
            const preSelectedLots = irrigationData.selectedLots.map(lot => ({
                id_lote: lot.rowid,
                area_utilizada: 0 // Start with 0 and let user specify the area
            }));
            setSelectedLots(preSelectedLots);

            // Pre-select sublots from irrigationData
            const preSelectedSublots = irrigationData.selectedSublots.map(sublot => ({
                id_sub_lote: sublot.id_sub_lote,
                id_parent_lote: sublot.id_parent_lote,
                name: sublot.name,
                area_utilizada: 0 // Start with 0 and let user specify the area
            }));
            setSelectedSublots(preSelectedSublots);
        }
    }, [irrigationData, lots]);

    // Helper function to get maximum area for a lot
    const getMaxAreaForLot = (lotId: string) => {
        // First check if we have irrigationData with this lot
        if (irrigationData?.selectedLots) {
            const irrigationLot = irrigationData.selectedLots.find(l => l.rowid === lotId);
            if (irrigationLot) {
                return Number(irrigationLot.area_utilizada);
            }
        }

        // Fallback to lot data from lots
        const lot = lots?.find(l => l.rowid === lotId);
        return lot ? Number(lot.area_utilizada ? lot.area_utilizada : lot.area_real) : 0;
    };

    // Helper function to get maximum area for a sublot
    const getMaxAreaForSublot = (sublotId: string) => {
        // First check if we have irrigationData with this sublot
        if (irrigationData?.selectedSublots) {
            const irrigationSublot = irrigationData.selectedSublots.find(s => s.id_sub_lote === sublotId);
            if (irrigationSublot) {
                return Number(irrigationSublot.area_utilizada);
            }
        }

        // Fallback to sublot data from lots
        const sublot = lots?.flatMap(l => l.sublots).find(s => s?.rowid === sublotId);
        return sublot ? Number(sublot.area_utilizada) : 0;
    };

    // Lot and sublot handling functions
    const handleLotAreaChange = (lotId: string, area: number) => {
        const maxArea = getMaxAreaForLot(lotId);

        if (area > maxArea) {
            toast.error(`El área no puede ser mayor a ${maxArea}`);
            return;
        }

        setSelectedLots(prev => {
            const existing = prev.find(l => l.id_lote === lotId);
            if (existing) {
                return prev.map(l => l.id_lote === lotId ? { ...l, area_utilizada: area } : l);
            }
            return [...prev, { id_lote: lotId, area_utilizada: area }];
        });
    };

    const handleLotSelection = (lotId: string, checked: boolean) => {
        if (checked) {
            setSelectedLots(prev => [...prev, { id_lote: lotId, area_utilizada: 0}]);
        } else {
            setSelectedLots(prev => prev.filter(l => l.id_lote !== lotId));
            // Remove associated sublots when unselecting a lot
            setSelectedSublots(prev => prev.filter(s => s.id_parent_lote !== lotId));
        }
    };

    const handleSublotSelection = (sublotId: string, checked: boolean) => {
        const sublot = lots?.flatMap(l => l.sublots).find(s => s?.rowid === sublotId);

        if (checked) {
            setSelectedSublots(prev => [...prev, { 
                id_sub_lote: sublotId, 
                area_utilizada: 0, 
                id_parent_lote: sublot?.lot_id || '', 
                name: sublot?.name || '' 
            }]);
        } else {
            setSelectedSublots(prev => prev.filter(s => s.id_sub_lote !== sublotId));
        }
    }

    const handleSublotAreaChange = (sublotId: string, area: number) => {
        const maxArea = getMaxAreaForSublot(sublotId);

        if (area > maxArea) {
            toast.error(`El área no puede ser mayor a ${maxArea}`);
            return;
        }

        setSelectedSublots(prev => prev.map(s => 
            s.id_sub_lote === sublotId ? { ...s, area_utilizada: area } : s
        ));
    }

    return {
        crops,
        lots,
        sortedCrops,
        selectedCrop,
        isLoading: isLoadingCrops || isLoadingLots,

        handleLotSelection,
        selectedLots,
        setSelectedLots,
        handleLotAreaChange,
        
        handleSublotSelection,
        selectedSublots,
        setSelectedSublots,
        handleSublotAreaChange,
        
        // Exponer las funciones para obtener el área máxima
        getMaxAreaForLot,
        getMaxAreaForSublot,
    };
}; 