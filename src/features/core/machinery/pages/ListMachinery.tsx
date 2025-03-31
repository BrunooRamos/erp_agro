import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from '@tanstack/react-table';

import { MachineryEntity } from "../../../../interfaces";
import { useMachinery } from '../../../../hooks';


export const ListMachinery = () => {
    const { listMachinery, deactivateMachinery } = useMachinery(null)

    const { data = [], isLoading, error, refetch } = listMachinery;
    const { mutate: deleteMachinery, isPending: isDeletePending } = deactivateMachinery;
    
    const navigate = useNavigate();
    
    const columnHelper = createColumnHelper<MachineryEntity>();
    
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);


    const handleEdit = (machinery: MachineryEntity) => {
        navigate(`/machinery/edit/${machinery.code}`);
    };

    const handleDelete = (machinery: MachineryEntity) => {
        const confirmMessage = `¿Está seguro que desea eliminar la siguiente maquinaria?\n\nCódigo: ${machinery.code}\nNombre: ${machinery.name}\nMarca: ${machinery.brand}\nModelo: ${machinery.model}`;
        
        if (window.confirm(confirmMessage)) {
            deleteMachinery(machinery.code, {
                onSuccess: () => {
                    refetch();
                }
            });
        }
    };

    const columns = [
        columnHelper.accessor('code', {
            header: 'Código',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: 'Nombre',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('brand', {
            header: 'Marca',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('model', {
            header: 'Modelo',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('year_fabrication', {
            header: 'Año Fabricación',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('description', {
            header: 'Descripción',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('year_purchase', {
            header: 'Año Compra',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('plate', {
            header: 'Placa',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('cusa.laboreo', {
            header: 'Labor',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('cusa.precio_cusa', {
            header: 'Costo CUSA',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('cusa.lts_ha', {
            header: 'Litros',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('maintenance_hours', {
            header: 'Horas Mant.',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('padron', {
            header: 'Padrón',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('id_padron', {
            header: 'ID Padrón',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('insurance', {
            header: 'Seguro',
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
                    <button 
                        onClick={() => handleDelete(info.row.original)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                        <i className="fas fa-trash-alt mr-1"></i>
                        Eliminar
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

    const handleScrollLeft = () => {
        const tableContainer = document.getElementById('table-container');
        if (tableContainer) {
            tableContainer.scrollLeft -= 200; // Adjust scroll amount as needed
        }
    };

    const handleScrollRight = () => {
        const tableContainer = document.getElementById('table-container');
        if (tableContainer) {
            tableContainer.scrollLeft += 200; // Adjust scroll amount as needed
        }
    };

    if (isLoading || isDeletePending) {
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
        <div className=" p-6 rounded-lg shadow-sm">
            {/* Title */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-zinc-800">
                    <i className="fa-solid fa-tractor mr-3 text-zinc-600"></i>
                    Lista de Maquinaria
                </h1>
                <button
                    onClick={() => navigate('/machinery/create')}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nueva Maquinaria
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
                        value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            table.getColumn('code')?.setFilterValue(e.target.value)
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
                        placeholder="Buscar por marca"
                        value={(table.getColumn('brand')?.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            table.getColumn('brand')?.setFilterValue(e.target.value)
                        }
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
                    />
                    </div>
                </div>
            </div>
            
            {/* Actions */}
            <div className="relative mb-4">
                <div className="flex gap-2 justify-end">
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        aria-label="Actualizar registros"
                    >
                        <i className="fas fa-sync-alt text-zinc-600"></i>
                    </button>
                    <div className="flex rounded-lg border border-gray-200 bg-white">
                    <button
                            title="Desplazar a la izquierda"
                        onClick={handleScrollLeft}
                            className="px-4 py-2 hover:bg-gray-50 transition-colors duration-200 border-r border-gray-200"
                    >
                            <i className="fas fa-chevron-left text-zinc-600"></i>
                    </button>
                    <button
                            title="Desplazar a la derecha"
                        onClick={handleScrollRight}
                            className="px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                    >
                            <i className="fas fa-chevron-right text-zinc-600"></i>
                    </button>
                    </div>
                </div>
                </div>

            {/* Replace table with cards */}
            <div className="grid grid-cols-1 gap-4">
                {table.getRowModel().rows
                    .sort((a, b) => {
                        // Primero ordenamos por status (1 antes que 0)
                        const statusA = a.original.status === '1' ? 1 : 0;
                        const statusB = b.original.status === '1' ? 1 : 0;
                        
                        if (statusA !== statusB) {
                            return statusB - statusA; // Orden descendente para que 1 venga primero
                        }
                        
                        // Si el status es igual, ordenamos por nombre
                        return a.original.name.localeCompare(b.original.name);
                    })
                    .map(row => {
                        const machinery = row.original;
                        return (
                            <div 
                                key={machinery.code}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                            >
                                {/* Header */}
                                <div className="px-6 py-4 bg-zinc-50 border-b border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <i className="fa-solid fa-tractor text-2xl text-zinc-600"></i>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-lg font-semibold text-zinc-800">
                                                        {machinery.name}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        machinery.status === '1' 
                                                            ? 'bg-green-100 text-green-800'
                                                            : machinery.status === '0'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${
                                                            machinery.status === '1'
                                                                ? 'bg-green-400'
                                                                : machinery.status === '0'
                                                                ? 'bg-red-400'
                                                                : 'bg-gray-400'
                                                        }`}></span>
                                                        {machinery.status === '1' 
                                                            ? 'Activo'
                                                            : machinery.status === '0'
                                                            ? 'Inactivo'
                                                            : 'Desconocido'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-zinc-500">
                                                    Código: {machinery.code}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleEdit(machinery)}
                                                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                                            >
                                                <i className="fas fa-edit mr-1.5"></i>
                                                Editar
                                            </button>
                                            {machinery.status === '1' && (
                                                <button 
                                                    onClick={() => handleDelete(machinery)}
                                                    className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                                                >
                                                    <i className="fas fa-down-long mr-1.5"></i>
                                                    Desactivar
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Specifications */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-2">
                                            <i className="fa-solid fa-clipboard-list mr-2 text-zinc-400"></i>
                                            Especificaciones
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Marca:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.brand}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Modelo:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.model}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Año Fabricación:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.year_fabrication || '-'}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Año Compra:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.year_purchase || '-'}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Operation Details */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-2">
                                            <i className="fa-solid fa-gauge mr-2 text-zinc-400"></i>
                                            Detalles de Operación
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Labor:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.cusa.laboreo}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Costo CUSA:</span>
                                                <span className="ml-2 text-zinc-800">${machinery.cusa.precio_cusa || '-'}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Consumo:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.cusa.lts_ha || '-'} L</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Horas Mant.:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.maintenance_hours || '-'}h</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Documentation */}
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-medium text-zinc-700 mb-2">
                                            <i className="fa-solid fa-file-alt mr-2 text-zinc-400"></i>
                                            Documentación
                                        </h4>
                                        <div className="space-y-2">
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Placa:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.plate || '-'}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Padrón:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.padron || '-'}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">ID Padrón:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.id_padron || '-'}</span>
                                            </p>
                                            <p className="text-sm">
                                                <span className="text-zinc-500">Seguro:</span>
                                                <span className="ml-2 text-zinc-800">{machinery.insurance || '-'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Description if exists */}
                                {machinery.description && (
                                    <div className="px-6 py-3 bg-zinc-50 border-t border-gray-200">
                                        <p className="text-sm text-zinc-600">
                                            <i className="fa-solid fa-comment-alt mr-2 text-zinc-400"></i>
                                            {machinery.description}
                                        </p>
                                    </div>
                                )}
                </div>
                        );
                    })}
            </div>
        </div>
    );
};