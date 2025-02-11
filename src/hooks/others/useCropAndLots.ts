import { useState } from "react";
import { Control, useWatch, Path } from "react-hook-form";
import { toast } from "react-toastify";
import { useCrop } from "./../index"; // Ajusta la ruta según tu estructura
import { GeneralLaborInterface, RAFSendData, SeedMapRegisterInterface, SelectedLot } from "../../interfaces";



export const useCropAndLots = <T extends RAFSendData | SeedMapRegisterInterface | GeneralLaborInterface>(control: Control<T>) => {
    // State for selected lots
    const [selectedLots, setSelectedLots] = useState<SelectedLot[]>([]);

    // Get crops
    const { listCrop } = useCrop();
    const { data: crops, isLoading: isLoadingCrops } = listCrop;

    // Watch crop code
    const selectedCropCode = useWatch({ 
        control, 
        name: "crop_code" as Path<T> 
    });
    
    // Get crop rowid
    const selectedCrop = crops?.find(crop => crop.code === selectedCropCode);

    // Get lots by crop
    const { getLotsByCropId } = useCrop(undefined, selectedCrop?.rowid);
    const { data: lots, isLoading: isLoadingLots } = getLotsByCropId;
    
    // Sort crops by code
    const sortedCrops = crops?.sort((a, b) => a.code.localeCompare(b.code));

    // Lot handling functions
    const handleLotAreaChange = (lotId: string, area: number) => {
        const lot = lots?.find(l => l.rowid === lotId);
        if (lot && +area > +lot.area_real) {
            toast.error(`El área no puede ser mayor a ${lot.area_real}`);
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
            setSelectedLots(prev => [...prev, { id_lote: lotId, area_utilizada: 0 }]);
        } else {
            setSelectedLots(prev => prev.filter(l => l.id_lote !== lotId));
        }
    };

    return {
        selectedLots,
        setSelectedLots,
        crops,
        lots,
        sortedCrops,
        selectedCrop,
        isLoading: isLoadingCrops || isLoadingLots,
        
        handleLotAreaChange,
        handleLotSelection
    };
}; 