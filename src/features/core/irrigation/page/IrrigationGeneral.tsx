import { useLocation } from "react-router-dom";
import { useIrrigation } from "../../../../hooks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { SelectedMaterialInfoResponse } from "../../../../interfaces/irrigation.interface";

export const IrrigationGeneral = () => {
  const location = useLocation();
  const irrigationData = location.state?.irrigationData;

  const {
    irrigationInfo,
    irrigationDeleteHours,
    irrigationDeleteFertirriegoProduct,
  } = useIrrigation(irrigationData.rowid);
  const { data: irrigationInfoData, isLoading } = irrigationInfo;

  const handleDeleteHours = (id: string) => {
    const loadingElement = document.getElementById("loading-spinner");
    if (loadingElement) {
      loadingElement.classList.remove("hidden");
    }

    irrigationDeleteHours.mutate(id, {
      onSuccess: () => {
        if (loadingElement) {
          loadingElement.classList.add("hidden");
        }
        irrigationInfo.refetch();
      },
      onError: (error) => {
        console.log(error);
        if (loadingElement) {
          loadingElement.classList.add("hidden");
        }
      },
    });
  };

  const handleDeleteFertirriegoProduct = (productId: string, fertirriegoId: string) => {
    const loadingElement = document.getElementById("loading-spinner");
    if (loadingElement) {
      loadingElement.classList.remove("hidden");
    }

    irrigationDeleteFertirriegoProduct.mutate({productId, fertirriegoId}, {
      onSuccess: () => {
        if (loadingElement) {
          loadingElement.classList.add("hidden");
        }
        irrigationInfo.refetch();
      },
      onError: (error) => {
        console.log(error);
        if (loadingElement) {
          loadingElement.classList.add("hidden");
        }
      },
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  if (!irrigationInfoData) {
    return <div>No se encontró información de riego</div>;
  }

  const formatDate = (date: Date) => {
    if (!date) return "N/A";
    return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: es });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div
        id="loading-spinner"
        className="fixed inset-0 items-center justify-center bg-white bg-opacity-75 z-50 hidden"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-zinc-800 border-b pb-2">
        Información General de Riego
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700">
            Datos Básicos
          </h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Código de Cultivo:</span>{" "}
              {irrigationInfoData.irrigation.crop_code}
            </p>
            <p>
              <span className="font-medium">Fecha:</span>{" "}
              {formatDate(irrigationInfoData.irrigation.date)}
            </p>
            <p>
              <span className="font-medium">Metros de Línea Madre:</span>{" "}
              {irrigationInfoData.irrigation.meters_of_line_mother}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700">Equipos</h2>
          <div className="space-y-2">
            {irrigationInfoData.irrigation.first_equipment && (
              <div>
                <p>
                  <span className="font-medium">Equipo Principal:</span>{" "}
                  {irrigationInfoData.irrigation.first_equipment.name || "No especificado"}
                </p>
                {irrigationInfoData.irrigation.first_equipment.brand && (
                  <p>
                    <span className="font-medium">Marca:</span>{" "}
                    {irrigationInfoData.irrigation.first_equipment.brand}
                  </p>
                )}
                {irrigationInfoData.irrigation.first_equipment.model && (
                  <p>
                    <span className="font-medium">Modelo:</span>{" "}
                    {irrigationInfoData.irrigation.first_equipment.model}
                  </p>
                )}
              </div>
            )}

            {irrigationInfoData.irrigation.second_equipment?.id && (
              <div className="mt-4">
                <p>
                  <span className="font-medium">Equipo Secundario:</span>{" "}
                  {irrigationInfoData.irrigation.second_equipment.name || "No especificado"}
                </p>
                {irrigationInfoData.irrigation.second_equipment.brand && (
                  <p>
                    <span className="font-medium">Marca:</span>{" "}
                    {irrigationInfoData.irrigation.second_equipment.brand}
                  </p>
                )}
                {irrigationInfoData.irrigation.second_equipment.model && (
                  <p>
                    <span className="font-medium">Modelo:</span>{" "}
                    {irrigationInfoData.irrigation.second_equipment.model}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Áreas de Riego */}
      {(irrigationInfoData.selectedLots.length > 0 || irrigationInfoData.selectedSublots.length > 0) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700 border-b pb-2">
            Áreas de Riego
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Nombre</th>
                  <th className="py-2 px-4 text-left">Campo</th>
                  <th className="py-2 px-4 text-left">Tipo</th>
                  <th className="py-2 px-4 text-right">Área Utilizada (ha)</th>
                </tr>
              </thead>
              <tbody>
                {Array.from(new Set(irrigationInfoData.selectedLots.map(lot => lot.id_lote))).map((lotId) => {
                  const lot = irrigationInfoData.selectedLots.find(l => l.id_lote === lotId)!;
                  const childSublots = irrigationInfoData.selectedSublots.filter(
                    (sublot) => sublot.id_parent_lote === lot.id_lote
                  );

                  return (
                    <React.Fragment key={lot.id_lote}>
                      <tr className="border-b bg-gray-50">
                        <td className="py-2 px-4 font-medium">{lot.name}</td>
                        <td className="py-2 px-4">{lot.campo_name}</td>
                        <td className="py-2 px-4">Lote</td>
                        <td className="py-2 px-4 text-right">
                          {childSublots.length > 0 ? "" : lot.area_utilizada.toFixed(2)}
                        </td>
                      </tr>
                      {childSublots.map((sublot) => (
                        <tr key={sublot.id_sub_lote} className="border-b pl-4">
                          <td className="py-2 px-4 pl-8">└─ {sublot.name}</td>
                          <td className="py-2 px-4"></td>
                          <td className="py-2 px-4">Sublote</td>
                          <td className="py-2 px-4 text-right">
                            {sublot.area_utilizada.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Horas de Riego */}
      {irrigationInfoData.hours && irrigationInfoData.hours.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700 border-b pb-2">
            Horas de Riego
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Fecha</th>
                  <th className="py-2 px-4 text-right">Horas</th>
                  <th className="py-2 px-4 text-right">Consumo de Combustible</th>
                  <th className="py-2 px-4 text-right">Costo de Mantenimiento</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {irrigationInfoData.hours.map((hour) => (
                  console.log(hour),
                  <tr key={hour.rowid} className="border-b">
                    <td className="py-2 px-4">{formatDate(hour.date)}</td>
                    <td className="py-2 px-4 text-right">{hour.hours}</td>
                    <td className="py-2 px-4 text-right">
                      {(hour.fuel_consumption_per_hour * hour.hours).toFixed(2)} L
                    </td>
                    <td className="py-2 px-4 text-right">
                      ${hour.maintenance_cost.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        title="Eliminar"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleDeleteHours(hour.rowid)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      
      {/* Fertirriego */}
      {irrigationInfoData.fertirriego && irrigationInfoData.fertirriego.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700 border-b pb-2">
            Fertirriego
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Fecha</th>
                  <th className="py-2 px-4 text-right">Área Total (ha)</th>
                  <th className="py-2 px-4 text-right">Cantidad de Productos</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {irrigationInfoData.fertirriego.map((fert) => (
                  <React.Fragment key={fert.rowid}>
                    <tr className="border-b">
                      <td className="py-2 px-4">
                        {formatDate(new Date(fert.date))}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {fert.total_area.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {fert.selectedMaterials?.length || 0}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {fert.selectedMaterials && 
                         fert.selectedMaterials.length > 0 && (
                          <button
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              const detailRow = document.getElementById(`fertirriego-details-${fert.rowid}`);
                              if (detailRow) {
                                detailRow.classList.toggle("hidden");
                              }
                            }}
                          >
                            Ver productos
                          </button>
                        )}
                      </td>
                    </tr>
                    {fert.selectedMaterials && 
                     fert.selectedMaterials.length > 0 && (
                      <tr id={`fertirriego-details-${fert.rowid}`} className="hidden bg-gray-50">
                        <td colSpan={4} className="p-4">
                          <div className="space-y-4">
                            <h4 className="font-medium">Productos utilizados:</h4>
                            <table className="min-w-full bg-white border">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="py-2 px-4 text-left">Producto</th>
                                  <th className="py-2 px-4 text-right">Cantidad</th>
                                  <th className="py-2 px-4 text-left">Unidad</th>
                                  <th className="py-2 px-4 text-left">Tipo</th>
                                  <th className="py-2 px-4 text-center">Acciones</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fert.selectedMaterials.map((material : SelectedMaterialInfoResponse) => (
                                  <tr key={material.id} className="border-t">
                                    <td className="py-2 px-4">{material.label}</td>
                                    <td className="py-2 px-4 text-right">{material.quantity}</td>
                                    <td className="py-2 px-4">{material.unit}</td>
                                    <td className="py-2 px-4">{material.type}</td>
                                    <td className="py-2 px-4 text-center">
                                      <button
                                        title="Eliminar"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() => handleDeleteFertirriegoProduct(material.id, fert.rowid)}
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Materiales */}
      {irrigationInfoData.selectedMaterials.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700 border-b pb-2">
            Materiales
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Producto</th>
                  <th className="py-2 px-4 text-right">Cantidad</th>
                  <th className="py-2 px-4 text-left">Unidad</th>
                  <th className="py-2 px-4 text-left">Tipo</th>
                  <th className="py-2 px-4 text-left">Almacén</th>
                </tr>
              </thead>
              <tbody>
                {irrigationInfoData.selectedMaterials.map((material) => (
                  <tr key={material.id} className="border-b">
                    <td className="py-2 px-4">{material.label}</td>
                    <td className="py-2 px-4 text-right">{material.quantity}</td>
                    <td className="py-2 px-4">{material.unit}</td>
                    <td className="py-2 px-4">{material.type}</td>
                    <td className="py-2 px-4">{material.warehouse_id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
