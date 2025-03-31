import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    createColumnHelper,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from '@tanstack/react-table';


import { FieldEntity } from "../../../../interfaces";
import { useField } from '../../../../hooks';

export const ListField = () => {
    const { 
        getFields, 
        //deleteField 
} = useField();

    const { data = [], isLoading, error, refetch } = getFields;
    //const { mutate: deleteFieldLot, isPending: isDeletePending } = deleteField;
    console.log(data);
    
    const navigate = useNavigate();
    
    const columnHelper = createColumnHelper<FieldEntity>();
    
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const handleEdit = (field: FieldEntity) => {
        navigate(`/field/edit/${field.rowid}`);
    };

    // const handleDelete = (field: FieldEntity) => {
    //     const confirmMessage = `¿Está seguro que desea eliminar el siguiente campo?\n\nCódigo: ${field.rowid}\nNombre: ${field.name}\n`;
        
    //     if (window.confirm(confirmMessage)) {
    //         deleteFieldLot(field.rowid, {
    //             onSuccess: () => {
    //                 refetch();
    //             }
    //         });
    //     }
    // };


    const columns = [
        columnHelper.accessor('rowid', {
            header: 'Código',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('name', {
            header: 'Nombre',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('description', {
            header: 'Descripción',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('location', {
            header: 'Ubicación',
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
        columnHelper.accessor('rented', {
            header: 'Arrendado',
            cell: info => info.getValue() ? 'Si' : 'No',
        }),
        // columnHelper.accessor('status', {
        //     header: 'Estado',
        //     cell: info => info.getValue() === '1' ? 'Activo' : 'Inactivo',
        // }),
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
                    {/* <button 
                        onClick={() => handleDelete(info.row.original)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                    >
                        <i className="fas fa-trash-alt mr-1"></i>
                        Eliminar
                    </button> */}
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

    if (
        isLoading 
        //|| 
        //isDeletePending
        ) {
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
                    <i className="fa-solid fa-map-location-dot mr-3 text-zinc-600"></i>
                    Lista de Campos
                </h1>
                <button
                    onClick={() => navigate('/field/create')}
                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nuevo Campo
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
                        placeholder="Buscar por ubicación"
                        value={(table.getColumn('location')?.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            table.getColumn('location')?.setFilterValue(e.target.value)
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
                </div>
                </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1  gap-4">
                {table.getRowModel().rows.map(row => {
                    const field = row.original;
                    return (
                        <div 
                            key={field.rowid}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-6 py-4 bg-zinc-50 border-b border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <i className="fa-solid fa-map-pin text-2xl text-zinc-600"></i>
                                        <div>
                                            <h3 className="text-lg font-semibold text-zinc-800">
                                                {field.name}
                                            </h3>
                                            <p className="text-sm text-zinc-500">
                                                Código: {field.rowid}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleEdit(field)}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                                        >
                                            <i className="fas fa-edit mr-1.5"></i>
                                            Editar
                                        </button>
                                        {/* <button 
                                            onClick={() => handleDelete(field)}
                                            className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                                        >
                                            <i className="fas fa-trash-alt mr-1.5"></i>
                                            Eliminar
                                        </button> */}
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                {/* Main Info Row */}
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {/* Location */}
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <i className="fa-solid fa-location-dot text-zinc-600"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-zinc-500">Ubicación</p>
                                            <p className="text-sm font-medium text-zinc-800 truncate">
                                                {field.location || '-'}
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
                                                {field.area_real ? `${field.area_real} ha` : '-'}
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
                                                {field.area_web ? `${field.area_web} ha` : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rented Status */}
                                    <div className="flex items-center gap-3 p-4 bg-zinc-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm">
                                            <i className="fa-solid fa-home text-zinc-600"></i>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-zinc-500">Estado de Renta</p>
                                            {field.rented === "1" ? (
                                                <div className="space-y-1">
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <i className="fas fa-check-circle mr-1"></i>
                                                        Rentado
                                                    </span>
                                                    {(field.period || field.rent_cost) && (
                                                        <div className="flex flex-col mt-1">
                                                            {field.period && (
                                                                <span className="text-xs text-zinc-600">
                                                                    <i className="far fa-clock mr-1"></i>
                                                                    {field.period} meses
                                                                </span>
                                                            )}
                                                            {field.rent_cost && (
                                                                <span className="text-xs text-zinc-600">
                                                                    <i className="fas fa-dollar-sign mr-1"></i>
                                                                    ${parseFloat(field.rent_cost).toLocaleString('es-PE', { minimumFractionDigits: 2 })} /mes
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    <i className="fas fa-times-circle mr-1"></i>
                                                    No Rentado
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Description if exists */}
                                {field.description && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-zinc-600">
                                            <i className="fa-solid fa-comment-alt mr-2 text-zinc-400"></i>
                                            {field.description}
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