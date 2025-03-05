import { usePrices } from "../../../../hooks";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState } from 'react';

export const DolarAndFuelPrice = () => {
    const { historicPrices } = usePrices();
    const { data: historicPricesData } = historicPrices;
    const [activeTab, setActiveTab] = useState<'dollar' | 'fuels'>('dollar');
    
    // Early return if data is not loaded yet
    if (!historicPricesData) {
        return <div>Cargando datos...</div>;
    }
    
    // Format dollar data for the chart
    const dollarData = historicPricesData.dollar
        .slice() // Create a copy of the array
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending
        .map(item => ({
            date: new Date(item.date).toLocaleDateString('es-UY'),
            compra: item.compra,
            venta: item.venta,
            promedio: item.avg
        }));
    
    // Format fuel data for the chart
    const fuelData = historicPricesData.fuels
        .slice() // Create a copy of the array
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) // Sort by date ascending
        .map(item => ({
            date: new Date(item.date).toLocaleDateString('es-UY'),
            super95: item.super95,
            premium97: item.premium97,
            gasoil10s: item.gasoil10s,
            gasoil50s: item.gasoil50s
        }));
    
    // Calculate min and max values for dollar chart
    const dollarValues = dollarData.flatMap(item => [item.compra, item.venta, item.promedio]);
    const maxDollar = Math.max(...dollarValues) + 3;
    const minDollar = Math.max(0, Math.min(...dollarValues) - 3);
    
    // Calculate min and max values for fuel chart
    const fuelValues = fuelData.flatMap(item => [item.super95, item.premium97, item.gasoil10s, item.gasoil50s]);
    const maxFuel = Math.max(...fuelValues) + 10;
    const minFuel = Math.max(0, Math.min(...fuelValues) - 10);
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Evolución de Precios: Dólar y Combustible</h1>
            
            {/* Tabs */}
            <div className="flex mb-4 border-b">
                <button 
                    className={`py-2 px-4 ${activeTab === 'dollar' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                    onClick={() => setActiveTab('dollar')}
                >
                    Dólar
                </button>
                <button 
                    className={`py-2 px-4 ${activeTab === 'fuels' ? 'border-b-2 border-blue-500 font-medium' : ''}`}
                    onClick={() => setActiveTab('fuels')}
                >
                    Combustibles
                </button>
            </div>
            
            {/* Charts */}
            <div className="bg-white p-4 rounded-lg shadow">
                {activeTab === 'dollar' ? (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Precio del Dólar</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={dollarData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[minDollar, maxDollar]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="compra" stroke="#8884d8" name="Compra" />
                                <Line type="monotone" dataKey="venta" stroke="#82ca9d" name="Venta" />
                                <Line type="monotone" dataKey="promedio" stroke="#ff7300" name="Promedio" />
                            </LineChart>
                        </ResponsiveContainer>
                        
                        {/* Current values */}
                        {dollarData.length > 0 && (
                            <div className="mt-6 grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Compra</p>
                                    <p className="text-2xl font-bold">${dollarData[dollarData.length - 1].compra}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Venta</p>
                                    <p className="text-2xl font-bold">${dollarData[dollarData.length - 1].venta}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Promedio</p>
                                    <p className="text-2xl font-bold">${dollarData[dollarData.length - 1].promedio}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Precio de Combustibles</h2>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={fuelData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[minFuel, maxFuel]} />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="super95" stroke="#8884d8" name="Nafta Super 95" />
                                <Line type="monotone" dataKey="premium97" stroke="#82ca9d" name="Nafta Premium 97" />
                                <Line type="monotone" dataKey="gasoil10s" stroke="#ff7300" name="Gasoil 10S" />
                                <Line type="monotone" dataKey="gasoil50s" stroke="#ff0000" name="Gasoil 50S" />
                            </LineChart>
                        </ResponsiveContainer>
                        
                        {/* Current values */}
                        {fuelData.length > 0 && (
                            <div className="mt-6 grid grid-cols-4 gap-4">
                                <div className="bg-purple-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Nafta Super 95</p>
                                    <p className="text-2xl font-bold">${fuelData[fuelData.length - 1].super95}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Nafta Premium 97</p>
                                    <p className="text-2xl font-bold">${fuelData[fuelData.length - 1].premium97}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Gasoil 10S</p>
                                    <p className="text-2xl font-bold">${fuelData[fuelData.length - 1].gasoil10s}</p>
                                </div>
                                <div className="bg-red-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500">Gasoil 50S</p>
                                    <p className="text-2xl font-bold">${fuelData[fuelData.length - 1].gasoil50s}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};