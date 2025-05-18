import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import { useCostCenter } from "../../../../hooks/cost-center/useCostCenter";
import { useCrop } from "../../../../hooks";
import { GetCostCenter } from "../../../../interfaces/cost-center.interface";
import { LaborCC, RafCC, SeedMapCC, IrrigationCC, FertirriegoCC, LogisticCC, WashProcessCC, TongProcessCC, CostBreakdown, MaintenanceCC, OtherExpensesCC } from "../../../../ui/components";

export const ResultStatus = () => {
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [selectedCrop, setSelectedCrop] = useState<string>("");
    const [costData, setCostData] = useState<GetCostCenter | null>(null);
    const [filteredData, setFilteredData] = useState<GetCostCenter | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [shouldFetch, setShouldFetch] = useState(false);

    const { listCrop } = useCrop();
    const { data: crops = [] } = listCrop;

    const { getAllCostCenter } = useCostCenter(startDate, endDate, shouldFetch);

    const handleSearch = async () => {
        if (!dateRange[0] || !dateRange[1]) {
            alert('Por favor seleccione un rango de fechas');
            return;
        }
        setStartDate(dateRange[0].format('YYYY-MM-DD'));
        setEndDate(dateRange[1].format('YYYY-MM-DD'));
        setShouldFetch(true);
        const response = await getAllCostCenter.refetch();
        if (response.data) {
            setCostData(response.data);
            setFilteredData(response.data);
        }
    };

    useEffect(() => {
        if (!costData) return;

        if (!selectedCrop) {
            setFilteredData(costData);
            return;
        }

        console.log(JSON.stringify(costData.expenses.fertirriego, null, 2));

        const filtered = {
            ...costData,
            expenses: {
                ...costData.expenses,
                labors: costData.expenses.labors.filter(labor => labor.crop_code === selectedCrop),
                rafs: costData.expenses.rafs.filter(raf => raf.crop_code === selectedCrop),
                seed_maps: costData.expenses.seed_maps.filter(seed => seed.crop_code === selectedCrop),
                irrigations: costData.expenses.irrigations.filter(irrigation => irrigation.crop_code === selectedCrop),
                fertirriego: costData.expenses.fertirriego.filter(fertirriego => fertirriego.crop_code === selectedCrop),
                wash_processes: costData.expenses.wash_processes.filter(wash_process => wash_process.crop_code === selectedCrop),
                tong_processes: costData.expenses.tong_processes.filter(tong_process => tong_process.crop_code === selectedCrop),
                logistic_costs: costData.expenses.logistic_costs.filter(logistic_cost => logistic_cost.crop_code === selectedCrop),
                other_expenses: costData.expenses.other_expenses.filter(other_expense => other_expense.crop_code === selectedCrop),
                maintenance_costs: costData.expenses.maintenance_costs
            },
            totals: {
                labors: costData.expenses.labors
                    .filter(labor => labor.crop_code === selectedCrop)
                    .reduce((sum, labor) => sum + labor.total_cost, 0),
                rafs: costData.expenses.rafs
                    .filter(raf => raf.crop_code === selectedCrop)
                    .reduce((sum, raf) => sum + raf.total_cost, 0),
                seed_maps: costData.expenses.seed_maps
                    .filter(seed => seed.crop_code === selectedCrop)
                    .reduce((sum, seed) => sum + seed.total_cost, 0),
                irrigation: costData.expenses.irrigations
                    .filter(irrigation => irrigation.crop_code === selectedCrop)
                    .reduce((sum, irrigation) => sum + irrigation.total_cost, 0),
                fertirriego: costData.expenses.fertirriego
                    .filter(fertirriego => fertirriego.crop_code === selectedCrop)
                    .reduce((sum, fertirriego) => sum + fertirriego.total_cost, 0),
                wash_processes: costData.expenses.wash_processes
                    .filter(wash_process => wash_process.crop_code === selectedCrop)
                    .reduce((sum, wash_process) => sum + wash_process.total_cost, 0),
                tong_processes: costData.expenses.tong_processes
                    .filter(tong_process => tong_process.crop_code === selectedCrop)
                    .reduce((sum, tong_process) => sum + tong_process.total_cost, 0),
                logistic_costs: costData.expenses.logistic_costs
                    .filter(logistic_cost => logistic_cost.crop_code === selectedCrop)
                    .reduce((sum, logistic_cost) => sum + logistic_cost.logistic_cost, 0),
                other_expenses: costData.expenses.other_expenses
                    .filter(other_expense => other_expense.crop_code === selectedCrop)
                    .reduce((sum, other_expense) => sum + other_expense.total_cost, 0),
                maintenance_costs: costData.expenses.maintenance_costs
                    .reduce((sum, maintenance) => sum + maintenance.total_cost, 0),
            },
            grand_total: costData.expenses.labors
                .filter(labor => labor.crop_code === selectedCrop)
                .reduce((sum, labor) => sum + labor.total_cost, 0) +
                costData.expenses.rafs
                    .filter(raf => raf.crop_code === selectedCrop)
                    .reduce((sum, raf) => sum + raf.total_cost, 0) +
                costData.expenses.seed_maps
                    .filter(seed => seed.crop_code === selectedCrop)
                    .reduce((sum, seed) => sum + seed.total_cost, 0) +
                costData.expenses.irrigations
                    .filter(irrigation => irrigation.crop_code === selectedCrop)
                    .reduce((sum, irrigation) => sum + irrigation.total_cost, 0) +
                costData.expenses.fertirriego
                    .filter(fertirriego => fertirriego.crop_code === selectedCrop)
                    .reduce((sum, fertirriego) => sum + fertirriego.total_cost, 0) +
                costData.expenses.wash_processes
                    .filter(wash_process => wash_process.crop_code === selectedCrop)
                    .reduce((sum, wash_process) => sum + wash_process.total_cost, 0) +
                costData.expenses.tong_processes
                    .filter(tong_process => tong_process.crop_code === selectedCrop)
                    .reduce((sum, tong_process) => sum + tong_process.total_cost, 0) +
                costData.expenses.logistic_costs
                    .filter(logistic_cost => logistic_cost.crop_code === selectedCrop)
                    .reduce((sum, logistic_cost) => sum + logistic_cost.logistic_cost, 0) +
                costData.expenses.other_expenses
                    .filter(other_expense => other_expense.crop_code === selectedCrop)
                    .reduce((sum, other_expense) => sum + other_expense.total_cost, 0) +
                costData.expenses.maintenance_costs
                    .reduce((sum, maintenance) => sum + maintenance.total_cost, 0),
            period: costData.period
        };

        setFilteredData(filtered);
    }, [selectedCrop, costData]);

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
                    {costData && (
                        <div className="flex-1 space-y-2">
                            <label className="block text-sm font-medium text-zinc-700">
                                <i className="fas fa-seedling mr-2 text-zinc-500"></i>
                                Cultivo
                            </label>
                            <select
                                title="Seleccionar cultivo"
                                className="w-full text-sm border-gray-200 rounded-lg shadow-sm hover:border-zinc-300 focus:ring-2 focus:ring-zinc-500 p-2"
                                value={selectedCrop}
                                onChange={(e) => setSelectedCrop(e.target.value)}
                            >
                                <option value="">Todos los cultivos</option>
                                {crops.map((crop) => (
                                    <option key={crop.code} value={crop.code}>
                                        {crop.code} - {crop.cultivo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
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

            {filteredData && (
                <>
                    {/* <SummaryCards totals={filteredData.totals} grandTotal={filteredData.grand_total} /> */}
                    {/* Detailed Lists */}
                    <div className="space-y-8">
                        <LaborCC data={filteredData.expenses.labors} />
                        <RafCC data={filteredData.expenses.rafs} />
                        <SeedMapCC data={filteredData.expenses.seed_maps} />
                        <IrrigationCC data={filteredData.expenses.irrigations} />
                        <FertirriegoCC data={filteredData.expenses.fertirriego} />
                        <LogisticCC data={filteredData.expenses.logistic_costs} />
                        <WashProcessCC data={filteredData.expenses.wash_processes} />
                        <TongProcessCC data={filteredData.expenses.tong_processes} />
                        <MaintenanceCC data={filteredData.expenses.maintenance_costs} />
                        <OtherExpensesCC data={filteredData.expenses.other_expenses} />
                    </div>

                    <CostBreakdown data={filteredData} />
                </>
            )}

            {/* Empty State */}
            {!filteredData && !getAllCostCenter.isLoading && (
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