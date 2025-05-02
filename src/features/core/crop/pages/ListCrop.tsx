import { useState } from "react";

import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";

import { useCrop } from "../../../../hooks/crop/useCrop";

import { CropEntity } from "../../../../interfaces";
import { useNavigate } from "react-router-dom";

export const ListCrop = () => {
  const navigate = useNavigate();

  const { listCrop, deleteCrop } = useCrop();

  const { data = [], isLoading, error, refetch } = listCrop;
  const { mutate: deleteCropAction, isPending: isDeletePending } = deleteCrop;

  const columnHelper = createColumnHelper<CropEntity>();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const handleDelete = (crop: CropEntity) => {
    const confirmMessage = `¿Está seguro que desea eliminar el siguiente cultivo?\n\nCódigo: ${crop.code}\nCampo: ${crop.codigo_campo}\nCultivo: ${crop.cultivo}`;

    if (window.confirm(confirmMessage)) {
      deleteCropAction(crop.code, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };


  const columns = [
    columnHelper.accessor("code", {
      header: "Código",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("campo_name", {
      header: "Campo",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("cultivo", {
      header: "Cultivo",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("periodo", {
      header: "Periodo",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("anio", {
      header: "Año",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("etapa", {
      header: "Etapa",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("description", {
      header: "Descripción",
      cell: (info) => info.getValue() || "-",
    }),
    columnHelper.accessor("status", {
      header: "Estado",
      cell: (info) => (info.getValue() === "1" ? "Activo" : "Inactivo"),
    }),
    columnHelper.display({
      id: "actions",
      header: "Acciones",
      cell: (info) => (
        <div className="flex gap-2">
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
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      {/* Title */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-zinc-800">
          <i className="fa-solid fa-seedling mr-3 text-zinc-600"></i>
          Lista de Cultivos
        </h1>
        <button
          onClick={() => navigate("/crop/create")}
          className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors duration-200"
        >
          <i className="fas fa-plus mr-2"></i>
          Nuevo Cultivo
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
              value={
                (table.getColumn("code")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("code")?.setFilterValue(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar por campo"
              value={
                (table.getColumn("campo_name")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) =>
                table.getColumn("campo_name")?.setFilterValue(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
            />
          </div>
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar por cultivo"
              value={
                (table.getColumn("cultivo")?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn("cultivo")?.setFilterValue(e.target.value)
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-zinc-800 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4">
        {table.getRowModel().rows.map((row) => {
          const crop = row.original;
          return (
            <div
              key={crop.code}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 bg-zinc-50 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-leaf text-2xl text-zinc-600"></i>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-zinc-800">
                          {crop.cultivo}
                        </h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            crop.status === "1"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {crop.status === "1" ? "Activo" : "Inactivo"}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-500">
                        Código: {crop.code}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {/* Campo */}
                  <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-map text-zinc-600 text-sm"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 -mb-0.5">Campo</p>
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {crop.campo_name || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Periodo */}
                  <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-calendar text-zinc-600 text-sm"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 -mb-0.5">Periodo</p>
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {crop.periodo || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Año */}
                  <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-clock text-zinc-600 text-sm"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 -mb-0.5">Año</p>
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {crop.anio || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Etapa */}
                  <div className="flex items-center gap-2 p-2 bg-zinc-50 rounded-lg">
                    <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                      <i className="fa-solid fa-tasks text-zinc-600 text-sm"></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-zinc-500 -mb-0.5">Etapa</p>
                      <p className="text-sm font-medium text-zinc-800 truncate">
                        {crop.etapa || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Lots Information */}
                {crop.lots && crop.lots.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-zinc-700 mb-3 flex items-center">
                      <i className="fa-solid fa-layer-group mr-2 text-zinc-500"></i>
                      Lotes y Sublotes
                    </h4>
                    <div className="space-y-1">
                      {crop.lots.map((lot) => (
                        <div 
                          key={lot.id} 
                          className="bg-zinc-50 p-2 rounded-lg flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <i className="fa-solid fa-map-marker-alt text-zinc-500 text-sm"></i>
                              <span className="text-sm font-medium text-zinc-700">{lot.name}</span>
                              <span className="text-xs text-zinc-500">({lot.area_utilizada} ha)</span>
                            </div>
                            
                            {/* Sub Lots inline */}
                            {lot.sub_lots && lot.sub_lots.length > 0 && (
                              <div className="flex items-center gap-1">
                                <span className="text-zinc-400">|</span>
                                <div className="flex items-center gap-2">
                                  {lot.sub_lots.map((subLot, index) => (
                                    <div 
                                      key={index}
                                      className="flex items-center gap-1 bg-white px-2 py-0.5 rounded"
                                    >
                                      <i className="fa-solid fa-puzzle-piece text-zinc-400 text-xs"></i>
                                      <span className="text-xs text-zinc-600">{subLot.name}</span>
                                      <span className="text-xs text-zinc-400">({subLot.area_utilizada} ha)</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description if exists */}
                {crop.description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-zinc-600">
                      <i className="fa-solid fa-comment-alt mr-2 text-zinc-400"></i>
                      {crop.description}
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
};
