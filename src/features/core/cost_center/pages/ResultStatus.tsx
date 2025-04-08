import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { Dayjs } from "dayjs";
import { useCostCenter } from "../../../../hooks/cost-center/useCostCenter";
import { useCrop } from "../../../../hooks";
import { GetCostCenter } from "../../../../interfaces/cost-center.interface";
import { SummaryCards, LaborCC, RafCC, SeedMapCC, IrrigationCC, FertirriegoCC } from "../../../../ui/components";

export const ResultStatus = () => {
    const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
    const [selectedCrop, setSelectedCrop] = useState<string>("");
    const [costData, setCostData] = useState<GetCostCenter | null>(null);
    const [filteredData, setFilteredData] = useState<GetCostCenter | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [shouldFetch, setShouldFetch] = useState(false);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        labors: false,
        rafs: false,
        seed_maps: false,
        irrigations: false,
        fertirriego: false
    });

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

        const filtered = {
            ...costData,
            expenses: {
                ...costData.expenses,
                labors: costData.expenses.labors.filter(labor => labor.crop_code === selectedCrop),
                rafs: costData.expenses.rafs.filter(raf => raf.crop_code === selectedCrop),
                seed_maps: costData.expenses.seed_maps.filter(seed => seed.crop_code === selectedCrop),
                irrigations: costData.expenses.irrigations.filter(irrigation => irrigation.crop_code === selectedCrop),
                fertirriego: costData.expenses.fertirriego.filter(fertirriego => fertirriego.crop_code === selectedCrop)
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
                    .reduce((sum, fertirriego) => sum + fertirriego.total_cost, 0)
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
                    .reduce((sum, fertirriego) => sum + fertirriego.total_cost, 0),
            period: costData.period
        };

        setFilteredData(filtered);
    }, [selectedCrop, costData]);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
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
                    <SummaryCards totals={filteredData.totals} grandTotal={filteredData.grand_total} />

                    {/* Detailed Lists */}
                    <div className="space-y-8">
                        <LaborCC data={filteredData.expenses.labors} />
                        <RafCC data={filteredData.expenses.rafs} />
                        <SeedMapCC data={filteredData.expenses.seed_maps} />
                        <IrrigationCC data={filteredData.expenses.irrigations} />
                        <FertirriegoCC data={filteredData.expenses.fertirriego} />
                    </div>

                    {/* Cost Breakdown Table */}
                    <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-100">
                            <h2 className="text-lg font-semibold text-zinc-800 flex items-center">
                                <i className="fas fa-chart-pie mr-3 text-zinc-600"></i>
                                Desglose de Costos
                            </h2>
                        </div>
                        <div className="p-6">
                            {/* Total General */}
                            <div className="flex items-center justify-between py-4 border-b-2 border-zinc-800">
                                <div className="flex items-center">
                                    <span className="text-xl font-bold text-zinc-800">Total General</span>
                                </div>
                                <span className="text-xl font-bold text-zinc-800">
                                    ${filteredData.grand_total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            {/* Categorías Principales */}
                            <div className="mt-4 space-y-4">
                                {/* Labores */}
                                <div className="pl-4">
                                    <div 
                                        className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                                        onClick={() => toggleSection('labors')}
                                    >
                                        <div className="flex items-center">
                                            <i className={`fas fa-chevron-${expandedSections.labors ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                            <i className="fas fa-tractor text-blue-500 mr-3"></i>
                                            <span className="font-medium text-zinc-700">Labores</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-zinc-500">
                                                {((filteredData.totals.labors / filteredData.grand_total) * 100).toFixed(1)}%
                                            </span>
                                            <span className="font-medium text-zinc-700">
                                                ${filteredData.totals.labors.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSections.labors && (
                                        <div className="pl-8 mt-2 space-y-2">
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-users text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Labor</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.labors.reduce((sum, labor) => sum + labor.labor_cost, 0) / filteredData.totals.labors) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.labors.reduce((sum, labor) => sum + labor.labor_cost, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Combustible</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.labors.reduce((sum, labor) => sum + labor.fuel_cost_usd, 0) / filteredData.totals.labors) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.labors.reduce((sum, labor) => sum + labor.fuel_cost_usd, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RAFs */}
                                <div className="pl-4">
                                    <div 
                                        className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                                        onClick={() => toggleSection('rafs')}
                                    >
                                        <div className="flex items-center">
                                            <i className={`fas fa-chevron-${expandedSections.rafs ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                            <i className="fas fa-spray-can text-green-500 mr-3"></i>
                                            <span className="font-medium text-zinc-700">RAFs</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-zinc-500">
                                                {((filteredData.totals.rafs / filteredData.grand_total) * 100).toFixed(1)}%
                                            </span>
                                            <span className="font-medium text-zinc-700">
                                                ${filteredData.totals.rafs.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSections.rafs && (
                                        <div className="pl-8 mt-2 space-y-2">
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-users text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Labor</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.rafs.reduce((sum, raf) => sum + raf.labor_cost, 0) / filteredData.totals.rafs) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.rafs.reduce((sum, raf) => sum + raf.labor_cost, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Combustible</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.rafs.reduce((sum, raf) => sum + raf.fuel_cost_usd, 0) / filteredData.totals.rafs) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.rafs.reduce((sum, raf) => sum + raf.fuel_cost_usd, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-box text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Productos</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.rafs.reduce((sum, raf) => sum + raf.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / filteredData.totals.rafs) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.rafs.reduce((sum, raf) => sum + raf.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Siembras */}
                                <div className="pl-4">
                                    <div 
                                        className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                                        onClick={() => toggleSection('seed_maps')}
                                    >
                                        <div className="flex items-center">
                                            <i className={`fas fa-chevron-${expandedSections.seed_maps ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                            <i className="fas fa-seedling text-yellow-500 mr-3"></i>
                                            <span className="font-medium text-zinc-700">Siembras</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-zinc-500">
                                                {((filteredData.totals.seed_maps / filteredData.grand_total) * 100).toFixed(1)}%
                                            </span>
                                            <span className="font-medium text-zinc-700">
                                                ${filteredData.totals.seed_maps.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSections.seed_maps && (
                                        <div className="pl-8 mt-2 space-y-2">
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-users text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Labor</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.seed_maps.reduce((sum, seed) => sum + seed.labor_cost, 0) / filteredData.totals.seed_maps) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.seed_maps.reduce((sum, seed) => sum + seed.labor_cost, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Combustible</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.seed_maps.reduce((sum, seed) => sum + seed.fuel_cost_usd, 0) / filteredData.totals.seed_maps) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.seed_maps.reduce((sum, seed) => sum + seed.fuel_cost_usd, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-box text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Productos</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.seed_maps.reduce((sum, seed) => sum + seed.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / filteredData.totals.seed_maps) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.seed_maps.reduce((sum, seed) => sum + seed.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Irrigaciones */}
                                <div className="pl-4">
                                    <div 
                                        className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                                        onClick={() => toggleSection('irrigations')}
                                    >
                                        <div className="flex items-center">
                                            <i className={`fas fa-chevron-${expandedSections.irrigations ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                            <i className="fas fa-water text-blue-400 mr-3"></i>
                                            <span className="font-medium text-zinc-700">Irrigaciones</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-zinc-500">
                                                {((filteredData.totals.irrigation / filteredData.grand_total) * 100).toFixed(1)}%
                                            </span>
                                            <span className="font-medium text-zinc-700">
                                                ${filteredData.totals.irrigation.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSections.irrigations && (
                                        <div className="pl-8 mt-2 space-y-2">
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-tint text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Línea Madre</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.cost_mother_line, 0) / filteredData.totals.irrigation) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.cost_mother_line, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-tools text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Mantenimiento</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.maintenance_cost_usd, 0) / filteredData.totals.irrigation) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.maintenance_cost_usd, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-gas-pump text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Combustible</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.fuel_cost_usd, 0) / filteredData.totals.irrigation) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.fuel_cost_usd, 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-box text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Productos</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / filteredData.totals.irrigation) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.irrigations.reduce((sum, irr) => sum + irr.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Fertirriego */}
                                <div className="pl-4">
                                    <div 
                                        className="flex items-center justify-between py-2 border-b border-zinc-100 cursor-pointer hover:bg-zinc-50 rounded-lg px-2"
                                        onClick={() => toggleSection('fertirriego')}
                                    >
                                        <div className="flex items-center">
                                            <i className={`fas fa-chevron-${expandedSections.fertirriego ? 'down' : 'right'} text-zinc-400 mr-2`}></i>
                                            <i className="fas fa-fill-drip text-purple-500 mr-3"></i>
                                            <span className="font-medium text-zinc-700">Fertirriego</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-sm text-zinc-500">
                                                {((filteredData.totals.fertirriego / filteredData.grand_total) * 100).toFixed(1)}%
                                            </span>
                                            <span className="font-medium text-zinc-700">
                                                ${filteredData.totals.fertirriego.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                    {expandedSections.fertirriego && (
                                        <div className="pl-8 mt-2 space-y-2">
                                            <div className="flex items-center justify-between py-1">
                                                <div className="flex items-center">
                                                    <i className="fas fa-box text-zinc-400 mr-2"></i>
                                                    <span className="text-zinc-600">Productos</span>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-zinc-500">
                                                        {((filteredData.expenses.fertirriego.reduce((sum, fert) => sum + fert.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0) / filteredData.totals.fertirriego) * 100).toFixed(1)}%
                                                    </span>
                                                    <span className="text-zinc-600">
                                                        ${filteredData.expenses.fertirriego.reduce((sum, fert) => sum + fert.products.reduce((pSum, product) => pSum + parseFloat(product.total_price), 0), 0).toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
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