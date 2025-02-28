import { IrrigationResponse } from "../../../../interfaces/irrigation.interface";
import { useNavigate } from "react-router-dom";

export const IrrigationCard = ({ data }: { data: IrrigationResponse }) => {
  const navigate = useNavigate();

  const handleHours = () => {
    navigate("/irrigation/hours", { state: { irrigationData: data } });
  };

  const handleFertirriego = () => {
    navigate("/irrigation/fertirriego", { state: { irrigationData: data } });
  };

  const handleInfo = () => {
    navigate("/irrigation/general", { state: { irrigationData: data } });
  };

  // Cálculo de Área Total
  const totalArea = [
    ...data.selectedLots.filter((lot) => lot.area_utilizada > 0),
    ...data.selectedSublots,
  ].reduce((acc, lot) => acc + lot.area_utilizada, 0);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col gap-4">
      {/* Encabezado */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
          Código de Cultivo
        </p>
        <h3 className="text-lg font-semibold text-gray-800">
          {data.irrigation.crop_code}
        </h3>
        <span className="text-xs text-gray-500">
          {new Date(data.irrigation.date).toLocaleDateString()}
        </span>
      </div>

      {/* Área Total */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-600">Área Total</span>
        <span className="text-sm font-bold text-gray-800">{totalArea} ha</span>
      </div>

      {/* Lotes Utilizados */}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase mb-2">
          Lotes Utilizados
        </p>
        <div className="flex flex-col gap-2">
          {data.selectedLots.map((lot) => (
            <div key={lot.rowid} className="flex flex-col gap-1">
              <div className="text-sm text-gray-700 font-medium">
                Lote padre:{" "}
                <span className="font-semibold">{lot.name}</span>
              </div>
              {lot.area_utilizada === 0 ? (
                // Sublotes
                <div className="flex flex-wrap gap-2">
                  {data.selectedSublots
                    .filter((sublot) => sublot.id_parent_lote === lot.rowid)
                    .map((sublot) => (
                      <span
                        key={sublot.id_sub_lote}
                        className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1"
                      >
                        {sublot.name} - {sublot.area_utilizada} ha
                      </span>
                    ))}
                </div>
              ) : (
                // Área del lote padre
                <span className="text-xs text-gray-600 bg-gray-100 rounded px-2 py-1">
                  Área utilizada: {lot.area_utilizada} ha
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Buttons Section */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 border-t border-gray-100 pt-4">
        <button
          onClick={handleHours}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
        >
          Agregar Horas
        </button>
        <button
          onClick={handleFertirriego}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
        >
          Fertirriego
        </button>
        <button
          onClick={handleInfo}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
        >
          Info
        </button>
      </div>
    </div>
  );
};
