import { useState } from "react";
import { OtherExpenseCostCenter } from "../../../interfaces";

interface OtherExpensesCCProps {
    data: OtherExpenseCostCenter[];
}

export const OtherExpensesCC = ({ data }: OtherExpensesCCProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatNumber = (value: number) => {
    return value.toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (!data?.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-zinc-800 flex items-center">
          <i className="fas fa-receipt text-purple-500 mr-3"></i>
          Otros Gastos
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-zinc-500 hover:text-zinc-700 transition-colors"
          title={isExpanded ? "Contraer" : "Expandir"}
        >
          <i
            className={`fas fa-chevron-${isExpanded ? "up" : "down"} text-lg`}
          ></i>
        </button>
      </div>

      {isExpanded && (
        <div className="divide-y divide-gray-100">
          {data.map((item) => (
            <div key={item.id} className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-700">Fecha</p>
                  <p className="text-zinc-800">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-700">
                    Código de Cultivo
                  </p>
                  <p className="text-zinc-800">{item.crop_code}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-zinc-700">Nombre</p>
                <p className="text-zinc-800">{item.name}</p>
              </div>

              {item.description && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-zinc-700">
                    Descripción
                  </p>
                  <p className="text-zinc-800">{item.description}</p>
                </div>
              )}

              <div className="mt-4">
                <p className="text-sm font-medium text-zinc-700 mb-2">Montos</p>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(item.amounts).map(([currency, amount]) => (
                    <div
                      key={currency}
                      className="bg-gray-50 rounded-lg p-3 shadow-sm"
                    >
                      <p className="text-xs font-medium text-zinc-600 uppercase tracking-wider">
                        {currency === "pesos" ? "Pesos" : "Dólares"}
                      </p>
                      <p className="text-lg font-semibold text-zinc-800 mt-1">
                        ${formatNumber(amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-zinc-700">Costo Total</p>
                <p className="text-lg font-semibold text-zinc-800">
                  ${formatNumber(item.total_cost)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 