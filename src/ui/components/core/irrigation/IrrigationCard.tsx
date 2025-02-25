import { IrrigationResponse } from "../../../../interfaces/irrigation.interface"
import { useNavigate } from "react-router-dom";

export const IrrigationCard = ( { data }: { data: IrrigationResponse } ) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/irrigation/hours', { state: { irrigationData: data } });
    };

    return (
        <div 
            onClick={handleClick}
            className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 cursor-pointer"
        >
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/5 to-zinc-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Content Container */}
          <div className="p-6">
            {/* Header Section */}
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 tracking-wider uppercase mb-1">
                    Código de Cultivo
                  </p>
                  <h3 className="text-xl font-bold text-zinc-900">
                    {data.irrigation.crop_code}
                  </h3>
                </div>
                <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-full">
                  {new Date(data.irrigation.date).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-sm font-medium text-zinc-600">Área Total</span>
            <span className="text-sm font-bold text-zinc-800">{data.lots.reduce((acc, lot) => acc + lot.area_utilizada, 0)} ha</span>
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500 uppercase">Lotes Utilizados</p>
            <div className="flex flex-wrap gap-2">
              {data.lots.map((lot) => (
                <div 
                  key={lot.id_lote}
                  className="inline-flex items-center gap-1.5 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100"
                >
                  <i className="fa-solid fa-map-pin text-blue-500 text-xs" />
                  <span className="text-sm font-medium text-blue-700">
                    {lot.name}
                  </span>
                  <span className="text-xs font-medium text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded-full">
                    {lot.area_utilizada} ha
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}