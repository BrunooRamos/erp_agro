import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePostHarvest } from "../../../../../hooks";
import { TongProcessResponse } from "../../../../../interfaces";

export const ListTongProcesses = () => {
    const navigate = useNavigate();
    const { listTongProcesses } = usePostHarvest();
    const { data: tongProcesses = [] } = listTongProcesses;
    
    // Estado para el proceso seleccionado
    const [selectedProcess, setSelectedProcess] = useState<TongProcessResponse | null>(null);
    // Estado para el filtro por nombre de producto
    const [selectedProduct, setSelectedProduct] = useState<string>("");

    // Obtener lista única de productos para el desplegable
    const uniqueProducts = Array.from(
        new Set(tongProcesses.map(process => process.parent_potato_name))
    ).sort();

    // Función para formatear la fecha
    const formatDate = (dateString: Date) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    // Función para calcular el costo total
    const calculateTotalCost = (costs: TongProcessResponse["costs"]) => {
        return costs.reduce((total, cost) => total + cost.total_cost, 0).toFixed(2);
    };

    // Filtrar los procesos según el producto seleccionado
    const filteredProcesses = selectedProduct 
        ? tongProcesses.filter(process => process.parent_potato_name === selectedProduct)
        : tongProcesses;

    return (
        <div className="container mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Procesos Tong</h1>
                <button 
                    onClick={() => navigate("/post-harvest/tong/proceso-tong")}
                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-md"
                >
                    Nuevo Proceso
                </button>
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variedad</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bines Entrada</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Costo Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredProcesses.map((process) => (
                            <tr key={process.rowid} className="hover:bg-gray-50">
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
                                    {process.potato_variety}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {process.input_bins}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    ${calculateTotalCost(process.costs)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button 
                                        onClick={() => setSelectedProcess(process)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                                    >
                                        Ver detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                        
                        {filteredProcesses.length === 0 && (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                                    {selectedProduct ? "No hay procesos para el producto seleccionado" : "No hay procesos registrados"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Sección de detalles visible en la pantalla */}
            {selectedProcess && (
                <div className="mt-6 bg-white shadow-md rounded-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold">Detalles del Proceso</h2>
                        <button 
                            title="Cerrar"
                            onClick={() => setSelectedProcess(null)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="font-semibold mb-2">Información General</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <p className="text-sm text-gray-600">Fecha:</p>
                                <p className="text-sm">{formatDate(selectedProcess.date)}</p>
                                
                                <p className="text-sm text-gray-600">Producto:</p>
                                <p className="text-sm">{selectedProcess.parent_potato_name}</p>
                                
                                <p className="text-sm text-gray-600">Variedad:</p>
                                <p className="text-sm">{selectedProcess.potato_variety}</p>
                                
                                <p className="text-sm text-gray-600">Bines Entrada:</p>
                                <p className="text-sm">{selectedProcess.input_bins}</p>
                                
                                <p className="text-sm text-gray-600">Nombre del Producto:</p>
                                <p className="text-sm">{selectedProcess.potato_name}</p>
                                
                                <p className="text-sm text-gray-600">Usuario:</p>
                                <p className="text-sm">{selectedProcess.user_created}</p>
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-semibold mb-2">Costos</h3>
                            {selectedProcess.costs.map((cost) => (
                                <div key={cost.rowid} className="mb-4 p-3 border border-gray-200 rounded-md">
                                    <div className="grid grid-cols-2 gap-2">
                                        <p className="text-sm text-gray-600">Fecha:</p>
                                        <p className="text-sm">{formatDate(cost.date)}</p>
                                        
                                        <p className="text-sm text-gray-600">Combustible:</p>
                                        <p className="text-sm">
                                            ${cost.fuel_cost} ({cost.fuel_liters} L)
                                        </p>
                                        
                                        <p className="text-sm text-gray-600">Elevador:</p>
                                        <p className="text-sm">USD {cost.lift_cost}</p>
                                        
                                        <p className="text-sm text-gray-600">Gata:</p>
                                        <p className="text-sm">USD {cost.gata_cost}</p>
                                        
                                        <p className="text-sm text-gray-600 font-semibold">Total:</p>
                                        <p className="text-sm font-semibold">
                                            ${cost.total_cost.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Salidas por Calibre</h3>
                        <div className="grid grid-cols-4 gap-4">
                            {selectedProcess.caliber_outputs.map((output) => (
                                <div key={output.rowid} className="p-3 border border-gray-200 rounded-md">
                                    <p className="text-sm font-medium">{output.caliber_name}</p>
                                    <p className="text-lg font-bold">{output.bins} bines</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
