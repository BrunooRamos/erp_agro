import { useState } from "react";
import { Control, useWatch, Path } from "react-hook-form";
import { toast } from "react-toastify";
import { useCrop } from "./../index"; // Ajusta la ruta según tu estructura
import { GeneralLabor, IrrigationFertirriegoSendData, IrrigationFormInterface, IrrigationHoursSendData, RAFSendData, SeedMapRegisterInterface, SelectedLot, SelectedSubLot } from "../../interfaces";



export const useCropAndLots = <T extends RAFSendData | SeedMapRegisterInterface | GeneralLabor | IrrigationFormInterface | IrrigationHoursSendData | IrrigationFertirriegoSendData>(
  control: Control<T>,
  initialCropCode?: string
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
    const { getLotsByCropId } = useCrop(undefined, selectedCrop?.rowid);
    const { data: lots, isLoading: isLoadingLots } = getLotsByCropId;
    
    // Sort crops by code
    const sortedCrops = crops?.sort((a, b) => a.code.localeCompare(b.code));

    // Lot and sublot handling functions
    const handleLotAreaChange = (lotId: string, area: number) => {
        const lot = lots?.find(l => l.rowid === lotId);
        const sublot = lots?.flatMap(l => l.sublots).find(s => s?.rowid === lotId);

        if (lot) {
            if (+area > +(lot.area_utilizada ? lot.area_utilizada : lot.area_real)) {
                toast.error(`El área no puede ser mayor a ${lot.area_utilizada ? lot.area_utilizada : lot.area_real}`);
                return;
            }

            setSelectedLots(prev => {
                const existing = prev.find(l => l.id_lote === lotId);
                if (existing) {
                    return prev.map(l => l.id_lote === lotId ? { ...l, area_utilizada: area } : l);
                }
                return [...prev, { id_lote: lotId, area_utilizada: area }];
            });
        } else if (sublot) {
            if (+area > +sublot.area_utilizada) {
                toast.error(`El área no puede ser mayor a ${sublot.area_utilizada}`);
                return;
            }

            setSelectedSublots(prev => {
                const existing = prev.find(s => s.id_sub_lote === lotId);
                if (existing) {
                    return prev.map(s => s.id_sub_lote === lotId ? { ...s, area_utilizada: area } : s);
                }
                const parentLot = lots?.find(l => l.sublots?.some(s => s.rowid === lotId));
                return [...prev, {
                    id_sub_lote: lotId,
                    id_parent_lote: parentLot?.rowid || '',
                    name: sublot.name,
                    area_utilizada: area
                }];
            });
        }
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
            setSelectedSublots(prev => [...prev, { id_sub_lote: sublotId, area_utilizada: 0, id_parent_lote: sublot?.lot_id || '', name: sublot?.name || '' }]);
        } else {
            setSelectedSublots(prev => prev.filter(s => s.id_sub_lote !== sublotId));
        }
    }

    const handleSublotAreaChange = (sublotId: string, area: number) => {
        const sublot = lots?.flatMap(l => l.sublots).find(s => s?.rowid === sublotId);

        if (sublot) {
            if (+area > +sublot.area_utilizada) {
                toast.error(`El área no puede ser mayor a ${sublot.area_utilizada}`);
                return;
            }

            setSelectedSublots(prev => prev.map(s => s.id_sub_lote === sublotId ? { ...s, area_utilizada: area } : s));
        }
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
    };
}; 