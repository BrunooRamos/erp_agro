import { useState } from "react";
import { usePostHarvest } from "../../../../../hooks";
import { WashProcessResponse } from "../../../../../interfaces";

export const ListWashProcesses = () => {
    const { listWashProcesses } = usePostHarvest();
    const { data: washProcesses = [] } = listWashProcesses;

    // Estado para el proceso expandido
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    // Estado para el filtro por nombre de producto
    const [selectedProduct, setSelectedProduct] = useState<string>("");

    // Obtener lista única de productos para el desplegable
    const uniqueProducts = Array.from(
        new Set(washProcesses.map((process: WashProcessResponse) => process.parent_potato_name))
    ).sort();

    // Función para formatear la fecha
    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Filtrar los procesos según el producto seleccionado
    const filteredProcesses = selectedProduct
        ? washProcesses.filter((process: WashProcessResponse) => process.parent_potato_name === selectedProduct)
        : washProcesses;

    const toggleRow = (rowId: string) => {
        setExpandedRowId(expandedRowId === rowId ? null : rowId);
    };

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Procesos de Lavado</h1>
            </div>

            {/* Filtro desplegable por nombre de producto */}
            <div className="mb-4">
                <select
                    title="Filtrar por producto"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-zinc-800"
                >
                    <option value="">Todos los productos</option>
                    {uniqueProducts.map(product => (
                        <option key={product} value={product}>
                            {product}
                        </option>
                    ))}
                </select>
            </div>

            {/* Tabla de procesos */}
            <div className="overflow-x-auto bg-white shadow-md rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bines Entrada</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProcesses.map((process: WashProcessResponse) => (
                            <>
                                <tr
                                    key={process.rowid}
                                    className="hover:bg-gray-50 cursor-pointer"
                                    onClick={() => toggleRow(process.rowid)}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatDate(process.date)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {process.parent_potato_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {process.potato_name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {process.number_of_bins}
                                    </td>
                                </tr>
                                {expandedRowId === process.rowid && (
                                    <tr key={`${process.rowid}-detail`}>
                                        <td colSpan={4} className="px-6 py-4 bg-gray-50">
                                            <h3 className="font-semibold mb-2">Bolsas por Calidad</h3>
                                            <div className="grid grid-cols-3 gap-4">
                                                {process.quality_outputs.map((output, index) => (
                                                    <div key={index} className="p-3 border border-gray-200 rounded-md bg-white">
                                                        <p className="text-sm font-medium">{output.quality_name}</p>
                                                        <p className="text-xs text-gray-500">{output.label_name}</p>
                                                        <p className="text-lg font-bold">{output.bags} bolsas</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        ))}

                        {filteredProcesses.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                    {selectedProduct ? "No hay procesos para el producto seleccionado" : "No hay procesos registrados"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
