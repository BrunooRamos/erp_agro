import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    ColumnFiltersState,
} from '@tanstack/react-table';

import { useListMachinery, useDeleteMachinery } from "../../../../hooks";
import { MachineryEntity } from "../../../../interfaces";


export const ListMachinery = () => {
    const { data = [], isLoading, error, refetch } = useListMachinery();
    const { mutate: deleteMachinery, isPending: isDeletePending } = useDeleteMachinery();
    
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
        columnHelper.accessor('labor', {
            header: 'Labor',
            cell: info => info.getValue(),
        }),
        columnHelper.accessor('cusa_cost', {
            header: 'Costo CUSA',
            cell: info => info.getValue() || '-',
        }),
        columnHelper.accessor('lts', {
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
        <div>
            {/* Title */}
            <h1 className="text-2xl font-bold mb-4">Lista de Maquinaria</h1>

            {/* Search (Filters) */}
            <div className="flex flex-col gap-2 mb-4">
                <div className="grid grid-cols-1 my-8 md:grid-cols-3 gap-2">
                    <input
                        type="text"
                        placeholder="Buscar por código"
                        value={(table.getColumn('code')?.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            table.getColumn('code')?.setFilterValue(e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Buscar por nombre"
                        value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            table.getColumn('name')?.setFilterValue(e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md"
                    />
                    <input
                        type="text"
                        placeholder="Buscar por marca"
                        value={(table.getColumn('brand')?.getFilterValue() as string) ?? ''}
                        onChange={(e) =>
                            table.getColumn('brand')?.setFilterValue(e.target.value)
                        }
                        className="p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>
            
            {/* Actions */}
            <div className="relative">
                <div className="absolute -top-10 right-0 flex gap-2">
                    <button
                        onClick={() => refetch()}
                        className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-800"
                        aria-label="Actualizar registros"
                    >
                        <i className="fas fa-sync-alt"></i>
                    </button>
                    <button
                        onClick={handleScrollLeft}
                        className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-800"
                        aria-label="Scroll left"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                        onClick={handleScrollRight}
                        className="px-3 py-1 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-800"
                        aria-label="Scroll right"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>


                {/* Table */}
                <div 
                    id="table-container"
                    className="overflow-x-auto scroll-smooth"
                >
                    <table className="min-w-full bg-white border border-gray-300">
                        <thead className="bg-zinc-100">
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th 
                                            key={header.id}
                                            className="px-6 py-3 text-left text-sm font-semibold text-zinc-800"
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map(row => (
                                <tr 
                                    key={row.id}
                                    className="border-t border-gray-300 hover:bg-zinc-50"
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td 
                                            key={cell.id}
                                            className="px-6 py-4 text-sm text-zinc-800"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};