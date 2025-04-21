import { useNavigate } from "react-router-dom";
import { ActionButtons } from "../../../../../ui/components";
import { useExpenses } from "../../../../../hooks";
import { useState } from "react";

export const DepreciationList = () => {
    const navigate = useNavigate();
    const { listDepreciation } = useExpenses();
    const { data: depreciations = [], isLoading } = listDepreciation;
    const [filter, setFilter] = useState<'all' | 'machinery' | 'other'>('all');

    const filteredDepreciations = depreciations.filter(depreciation => {
        if (filter === 'all') return true;
        if (filter === 'machinery') return depreciation.machinery !== null;
        if (filter === 'other') return depreciation.machinery === null;
        return true;
    });

    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Depreciación de Activos</h1>
                <ActionButtons
                    onCancel={() => navigate("/registers")}
                    onSubmit={() => navigate("/depreciation/create")}
                    submitLabel="Nueva Depreciación"
                />
            </div>

            <div className="flex space-x-4 mb-4">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Todos
                </button>
                <button
                    onClick={() => setFilter('machinery')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'machinery'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Maquinaria
                </button>
                <button
                    onClick={() => setFilter('other')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'other'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Otros Activos
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Activo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha Inicio
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Vida Útil
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor de Compra
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Valor Residual
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Depreciación Anual
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredDepreciations.map((depreciation) => (
                            <tr key={depreciation.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            {depreciation.machinery 
                                                ? `${depreciation.machinery.name} - ${depreciation.machinery.brand} ${depreciation.machinery.model}`
                                                : depreciation.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {depreciation.machinery 
                                                ? `Código: ${depreciation.machinery.code}`
                                                : depreciation.description}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(depreciation.date_start).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {depreciation.util_life} años
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${depreciation.purchase_value.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${depreciation.residual_value.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    ${depreciation.depreciation_value.toFixed(2)}
                                </td>   
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredDepreciations.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">No hay depreciaciones registradas</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Comienza creando una nueva depreciación para activos fijos o maquinaria.
                    </p>
                </div>
            )}
        </div>
    );
};