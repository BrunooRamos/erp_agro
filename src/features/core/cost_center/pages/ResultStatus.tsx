import { useState } from "react";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import { useCostCenter } from "../../../../hooks/cost-center/useCostCenter";
import { GetCostCenter } from "../../../../interfaces/cost-center.interface";
import { Registers, SummaryCards } from "../../../../ui/components";

export const ResultStatus = () => {
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [costData, setCostData] = useState<GetCostCenter | null>(null);

    const { getAllCostCenter } = useCostCenter(
        dateRange[0]?.format('YYYY-MM-DD') || '',
        dateRange[1]?.format('YYYY-MM-DD') || ''
    );

    const handleSearch = async () => {
        if (!dateRange[0] || !dateRange[1]) {
            alert('Por favor seleccione un rango de fechas');
            return;
        }

        const response = await getAllCostCenter.refetch();
        if (response.data) {
            setCostData(response.data);
        }
    };

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm min-h-screen">
            {/* Header with gradient background */}
            <div className="bg-gradient-to-r from-zinc-800 to-zinc-700 -m-6 mb-6 p-6 shadow-md">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <i className="fa-solid fa-calculator mr-3 opacity-75"></i>
                    Centro de Costos
                </h1>
                        <p className="text-zinc-300 text-sm mt-1">
                            Análisis detallado de costos por período
                        </p>
                    </div>
                </div>
            </div>

            {/* Date Range Selector Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm mb-8 border border-gray-100">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="block text-sm font-medium text-zinc-700">
                            <i className="fas fa-calendar-alt mr-2 text-zinc-500"></i>
                            Período de Análisis
                        </label>
                        <DatePicker.RangePicker
                            className="w-full text-sm border-gray-200 rounded-lg shadow-sm hover:border-zinc-300 focus:ring-2 focus:ring-zinc-500"
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates as [Dayjs, Dayjs])}
                            format="DD/MM/YYYY"
                            placeholder={['Fecha inicial', 'Fecha final']}
                            size="large"
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        disabled={getAllCostCenter.isLoading}
                        className="px-8 py-3 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-all duration-200 disabled:bg-zinc-400 shadow-sm hover:shadow-md flex items-center justify-center min-w-[150px]"
                    >
                        {getAllCostCenter.isLoading ? (
                            <>
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                                Cargando...
                            </>
                        ) : (
                            <>
                            <i className="fas fa-search mr-2"></i>
                                Analizar
                            </>
                        )}
                    </button>
                </div>
            </div>

            {costData && (
                <>
                    <SummaryCards totals={costData.totals} grandTotal={costData.grand_total} />

                    {/* Detailed Lists */}
                    <div className="space-y-8">
                        <Registers
                            type="labor"
                            data={costData.expenses.labors}
                            title="Labores"
                            icon="fas fa-tractor"
                            colorScheme={{
                                headerBg: "bg-blue-50",
                                headerBorder: "border-b border-blue-100",
                                headerText: "text-blue-800"
                            }}
                        />
                        
                        <Registers
                            type="raf"
                            data={costData.expenses.rafs}
                            title="RAFs"
                            icon="fas fa-spray-can"
                            colorScheme={{
                                headerBg: "bg-green-50",
                                headerBorder: "border-b border-green-100",
                                headerText: "text-green-800"
                            }}
                        />
                        
                        <Registers
                            type="seed_map"
                            data={costData.expenses.seed_maps}
                            title="Siembras"
                            icon="fas fa-seedling"
                            colorScheme={{
                                headerBg: "bg-yellow-50",
                                headerBorder: "border-b border-yellow-100",
                                headerText: "text-yellow-800"
                            }}
                        />
                    </div>
                </>
            )}

            {/* Empty State */}
            {!costData && !getAllCostCenter.isLoading && (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-50 flex items-center justify-center">
                        <i className="fas fa-search text-2xl text-zinc-300"></i>
                    </div>
                    <h3 className="text-lg font-medium text-zinc-700 mb-1">No hay datos para mostrar</h3>
                    <p className="text-zinc-500 text-sm">
                        Seleccione un rango de fechas y haga clic en Analizar para ver los costos
                    </p>
                </div>
            )}
        </div>
    );
};