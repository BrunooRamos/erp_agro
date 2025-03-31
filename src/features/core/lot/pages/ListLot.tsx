import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from '@tanstack/react-table';

import { useLot } from '../../../../hooks';
import { LotEntity } from '../../../../interfaces';


export const ListLot = () => {
    const { getLots } = useLot();
    const { data = [], isLoading, error } = getLots;
    
    const navigate = useNavigate();
    
    const columnHelper = createColumnHelper<LotEntity>();
    
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const handleEdit = (lot: LotEntity) => {
        const encodedCode = encodeURIComponent(lot.rowid);
        navigate(`/lot/edit/${encodedCode}`);
    };

    const columns = [
        columnHelper.accessor('rowid', {
            header: 'Código',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: 'Nombre',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('campo_name', {
            header: 'Campo',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('area_real', {
            header: 'Área Real',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('area_web', {
            header: 'Área Web',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('description', {
            header: 'Descripción',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.display({
            id: 'actions',
            header: 'Acciones',
            cell: (info) => (
                <div className="flex gap-2">
                    <button 
                        onClick={() => handleEdit(info.row.original)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                        <i className="fas fa-edit mr-1"></i>
                        Editar
                    </button>
                </div>
            ),
        }),
    ];

    const table = useReactTable({
        data,
        columns,
        state: {
            columnFilters,
        },
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });


    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                Error al cargar los datos: {error.message}
            </div>
        );
    }

    return (
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            {/* Title */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-zinc-800">
                    <i className="fa-solid fa-layer-group mr-3 text-zinc-600"></i>
                    Lista de Lotes
                </h1>
                <button
                    onClick={() => navigate('/lot/create')}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nuevo Lote
                </button>
            </div>

            {/* Search (Filters) */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Buscar por código"
                            value={(table.getColumn('rowid')?.getFilterValue() as string) ?? ''}
                            onChange={(e) =>
                                table.getColumn('rowid')?.setFilterValue(e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Buscar por nombre"
                            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                            onChange={(e) =>
                                table.getColumn('name')?.setFilterValue(e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        <input
                            type="text"
                            placeholder="Buscar por campo"
                            value={(table.getColumn('campo_name')?.getFilterValue() as string) ?? ''}
                            onChange={(e) =>
                                table.getColumn('campo_name')?.setFilterValue(e.target.value)
                            }
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
                        />
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 gap-4">
                {table.getRowModel().rows.map(row => {
                    const lot = row.original;
                    return (
                        <div 
                            key={lot.rowid}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 bg-zinc-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <i className="fa-solid fa-square-full text-2xl text-zinc-600"></i>
                                        <div>
                                            <h3 className="text-lg font-semibold text-zinc-800">
                                                {lot.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                Código: {lot.rowid}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleEdit(lot)}
                                        className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                                    >
                                        <i className="fas fa-edit mr-1.5"></i>
                                        Editar
                                    </button>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Campo */}
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <i className="fa-solid fa-map text-zinc-600"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-zinc-500">Campo</p>
                                            <p className="text-sm font-medium text-zinc-800 truncate">
                                                {lot.campo_name || '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Area Real */}
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <i className="fa-solid fa-chart-area text-zinc-600"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-zinc-500">Área Real</p>
                                            <p className="text-sm font-medium text-zinc-800 truncate">
                                                {lot.area_real ? `${lot.area_real} ha` : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Area Web */}
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <i className="fa-solid fa-globe text-zinc-600"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-zinc-500">Área Web</p>
                                            <p className="text-sm font-medium text-zinc-800 truncate">
                                                {lot.area_web ? `${lot.area_web} ha` : '-'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description if exists */}
                                {lot.description && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-zinc-600">
                                            <i className="fa-solid fa-comment-alt mr-2 text-zinc-400"></i>
                                            {lot.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}