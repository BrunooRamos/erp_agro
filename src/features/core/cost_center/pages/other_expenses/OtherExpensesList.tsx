import { useNavigate } from "react-router-dom";
import { ActionButtons } from "../../../../../ui/components";
import { useExpenses } from "../../../../../hooks";
import { useState } from "react";

export const OtherExpensesList = () => {
    const navigate = useNavigate();
    const { listOtherExpenses } = useExpenses();
    const { data: expenses = [], isLoading } = listOtherExpenses;
    const [filter, setFilter] = useState<'all' | 'with_crop' | 'without_crop'>('all');

    const filteredExpenses = expenses.filter(expense => {
        if (filter === 'all') return true;
        if (filter === 'with_crop') return expense.crop !== null;
        if (filter === 'without_crop') return expense.crop === null;
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
                <h1 className="text-2xl font-bold text-gray-800">Otros Gastos</h1>
                <ActionButtons
                    onCancel={() => navigate("/cost-center/other-expenses")}
                    onSubmit={() => navigate("/cost-center/other-expenses/create")}
                    submitLabel="Nuevo Gasto"
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
                    onClick={() => setFilter('with_crop')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'with_crop'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Con Cultivo
                </button>
                <button
                    onClick={() => setFilter('without_crop')}
                    className={`px-4 py-2 rounded-md ${
                        filter === 'without_crop'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Sin Cultivo
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Gasto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Monto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cultivo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Estado
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredExpenses.map((expense) => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                            {expense.name}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            {expense.description}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(expense.date).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {expense.amounts.pesos > 0 ? (
                                        <span>${expense.amounts.pesos.toFixed(2)} ARS</span>
                                    ) : (
                                        <span>${expense.amounts.usd.toFixed(2)} USD</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {expense.crop ? (
                                        <div className="flex flex-col">
                                            <span className="font-medium">{expense.crop.cultivo}</span>
                                            <span className="text-gray-500">Código: {expense.crop.code}</span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                        Activo
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredExpenses.length === 0 && (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900">No hay gastos registrados</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Comienza creando un nuevo gasto.
                    </p>
                </div>
            )}
        </div>
    );
};