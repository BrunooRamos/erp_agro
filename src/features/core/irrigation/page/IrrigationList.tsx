//import { useNavigate } from "react-router-dom";
import { useIrrigation } from "../../../../hooks/";
//import { IrrigationResponse } from "../../../../interfaces/irrigation.interface";
import { IrrigationCard } from "../../../../ui/components";

export const IrrigationList = () => {
    const { irrigationList } = useIrrigation();

    console.log(irrigationList.data);
//    const navigate = useNavigate();
    
    // const handleIrrigationClick = (irrigation: IrrigationResponse) => {
    //     navigate(`/irrigation/details/${irrigation.irrigation.rowid}`);
    // }
    
    if (irrigationList.isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }
    
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Lista de Riegos</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {irrigationList.data?.map((irrigation) => (
                    <IrrigationCard 
                        key={irrigation.irrigation.rowid} 
                        data={irrigation}
                    />
                ))}
            </div>

            {irrigationList.data?.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">
                        No hay registros de riego disponibles
                    </p>
                </div>
            )}
        </div>
    );
};