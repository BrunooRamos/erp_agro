import { useState } from "react";
import { TotalsCostCenter } from "../../../interfaces/";

interface SummaryCardsProps {
  totals: TotalsCostCenter;
  grandTotal: number;
}

export const SummaryCards = ({ totals, grandTotal }: SummaryCardsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const formatNumber = (value: number) => {
    return value.toLocaleString('es-PE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const calculatePercentage = (value: number) => {
    return ((value / grandTotal) * 100).toFixed(1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 border-b border-zinc-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white flex items-center">
          <i className="fas fa-chart-pie mr-3"></i>
          Resumen de Costos
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white hover:text-zinc-200 transition-colors"
          title={isExpanded ? "Contraer" : "Expandir"}
        >
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-lg`}></i>
        </button>
      </div>
      {isExpanded && (
        <div className="p-6">
          {/* Total General */}
          <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm border border-indigo-100">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-indigo-800">Total General</h3>
                <p className="text-sm text-indigo-600 mt-1">Suma de todos los costos del período</p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold text-indigo-800">${formatNumber(grandTotal)}</p>
              </div>
            </div>
          </div>

          {/* Grid de Costos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Labores */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-blue-800 flex items-center">
                    <i className="fas fa-tractor mr-2"></i>
                    Labores
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">Costos de mano de obra</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-800">${formatNumber(totals.labors)}</p>
                  <p className="text-xs text-blue-600">{calculatePercentage(totals.labors)}%</p>
                </div>
              </div>
            </div>

            {/* RAFs */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 shadow-sm border border-green-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-green-800 flex items-center">
                    <i className="fas fa-spray-can mr-2"></i>
                    RAFs
                  </h4>
                  <p className="text-xs text-green-600 mt-1">Aplicaciones de fertilizantes</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-green-800">${formatNumber(totals.rafs)}</p>
                  <p className="text-xs text-green-600">{calculatePercentage(totals.rafs)}%</p>
                </div>
              </div>
            </div>

            {/* Siembras */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 shadow-sm border border-yellow-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 flex items-center">
                    <i className="fas fa-seedling mr-2"></i>
                    Siembras
                  </h4>
                  <p className="text-xs text-yellow-600 mt-1">Costos de siembra</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-yellow-800">${formatNumber(totals.seed_maps)}</p>
                  <p className="text-xs text-yellow-600">{calculatePercentage(totals.seed_maps)}%</p>
                </div>
              </div>
            </div>

            {/* Irrigación */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 shadow-sm border border-blue-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-blue-800 flex items-center">
                    <i className="fas fa-water mr-2"></i>
                    Irrigación
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">Costos de riego</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-blue-800">${formatNumber(totals.irrigation)}</p>
                  <p className="text-xs text-blue-600">{calculatePercentage(totals.irrigation)}%</p>
                </div>
              </div>
            </div>

            {/* Fertirriego */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-sm border border-purple-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-purple-800 flex items-center">
                    <i className="fas fa-fill-drip mr-2"></i>
                    Fertirriego
                  </h4>
                  <p className="text-xs text-purple-600 mt-1">Aplicaciones de fertilizantes</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-purple-800">${formatNumber(totals.fertirriego)}</p>
                  <p className="text-xs text-purple-600">{calculatePercentage(totals.fertirriego)}%</p>
                </div>
              </div>
            </div>

            {/* Wash Process */}
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl p-4 shadow-sm border border-teal-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-sm font-medium text-teal-800 flex items-center">
                    <i className="fas fa-shower mr-2"></i>
                    Lavado
                  </h4>
                  <p className="text-xs text-teal-600 mt-1">Proceso de lavado</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-teal-800">${formatNumber(totals.wash_processes)}</p>
                  <p className="text-xs text-teal-600">{calculatePercentage(totals.wash_processes)}%</p>
                </div>
              </div>
            </div>

            {/* Tong Process */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-sm border border-orange-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
            <div>
                  <h4 className="text-sm font-medium text-orange-800 flex items-center">
                    <i className="fas fa-box mr-2"></i>
                    Tong
                  </h4>
                  <p className="text-xs text-orange-600 mt-1">Proceso de tong</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-orange-800">${formatNumber(totals.tong_processes)}</p>
                  <p className="text-xs text-orange-600">{calculatePercentage(totals.tong_processes)}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 