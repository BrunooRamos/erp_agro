import { useLocation } from "react-router-dom";
import { useIrrigation } from "../../../../hooks";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";

export const IrrigationGeneral = () => {
  const location = useLocation();
  const irrigationData = location.state?.irrigationData;

  const {
    irrigationInfo,
    irrigationDeleteHours,
    irrigationDeleteFertirriegoProduct,
  } = useIrrigation(irrigationData.irrigation.rowid);
  const { data: irrigationInfoData, isLoading } = irrigationInfo;

  console.log(JSON.stringify(irrigationInfoData, null, 2));

  const handleDeleteHours = (id: string) => {
    // Mostrar spinner mientras se elimina
    const loadingElement = document.getElementById("loading-spinner");
    if (loadingElement) {
      loadingElement.classList.remove("hidden");
    }

    irrigationDeleteHours.mutate(id, {
      onSuccess: () => {
        // Ocultar spinner cuando termine
        if (loadingElement) {
          loadingElement.classList.add("hidden");
        }
        irrigationInfo.refetch();
      },
      onError: (error) => {
        console.log(error);

        // Ocultar spinner en caso de error
        if (loadingElement) {
          loadingElement.classList.add("hidden");
        }
      },
    });
  };

  const handleDeleteFertirriegoProduct = (productRef: string) => {
    const loadingElement = document.getElementById("loading-spinner");
    if (loadingElement) {
      loadingElement.classList.remove("hidden");
    }

    irrigationDeleteFertirriegoProduct.mutate(productRef, {
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

  const {
    irrigation,
    selectedLots,
    selectedSublots,
    materials,
    hours,
    fertirriego,
  } = irrigationInfoData;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Spinner de carga oculto por defecto */}
      <div
        id="loading-spinner"
        className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50 hidden"
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
              {irrigation.crop_code}
            </p>
            <p>
              <span className="font-medium">Fecha:</span>{" "}
              {formatDate(irrigation.date)}
            </p>
            <p>
              <span className="font-medium">Metros de Línea Madre:</span>{" "}
              {irrigation.meters_of_line_mother}
            </p>
            <p>
              <span className="font-medium">Costo de Línea Madre:</span> $
              {Number(irrigation.cost_mother_line).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700">Equipos</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Equipo Principal:</span>{" "}
              {irrigation.first_equipment?.name || "No especificado"}
            </p>
            {irrigation.first_equipment?.brand && (
              <p>
                <span className="font-medium">Marca:</span>{" "}
                {irrigation.first_equipment.brand}
              </p>
            )}
            {irrigation.first_equipment?.model && (
              <p>
                <span className="font-medium">Modelo:</span>{" "}
                {irrigation.first_equipment.model}
              </p>
            )}

            {irrigation.second_equipment?.id && (
              <>
                <p className="mt-3">
                  <span className="font-medium">Equipo Secundario:</span>{" "}
                  {irrigation.second_equipment?.name || "No especificado"}
                </p>
                {irrigation.second_equipment?.brand && (
                  <p>
                    <span className="font-medium">Marca:</span>{" "}
                    {irrigation.second_equipment.brand}
                  </p>
                )}
                {irrigation.second_equipment?.model && (
                  <p>
                    <span className="font-medium">Modelo:</span>{" "}
                    {irrigation.second_equipment.model}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {(selectedLots.length > 0 || selectedSublots.length > 0) && (
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
                {selectedLots.map((lot) => {
                  // Filtrar sublotes que pertenecen a este lote
                  const childSublots = selectedSublots.filter(
                    (sublot) => sublot.id_parent_lote === lot.rowid
                  );

                  const hasChildSublots = childSublots.length > 0;

                  return (
                    <React.Fragment key={lot.rowid}>
                      <tr className="border-b bg-gray-50">
                        <td className="py-2 px-4 font-medium">{lot.name}</td>
                        <td className="py-2 px-4">{lot.campo_name}</td>
                        <td className="py-2 px-4">Lote</td>
                        <td className="py-2 px-4 text-right">
                          {hasChildSublots && lot.area_utilizada === 0
                            ? ""
                            : lot.area_utilizada.toFixed(2)}
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

                {/* Mostrar sublotes que no tienen un lote padre en la lista */}
                {selectedSublots
                  .filter(
                    (sublot) =>
                      !selectedLots.some(
                        (lot) => lot.rowid === sublot.id_parent_lote
                      )
                  )
                  .map((sublot) => (
                    <tr key={sublot.id_sub_lote} className="border-b">
                      <td className="py-2 px-4">{sublot.name}</td>
                      <td className="py-2 px-4"></td>
                      <td className="py-2 px-4">Sublote</td>
                      <td className="py-2 px-4 text-right">
                        {sublot.area_utilizada.toFixed(2)}
                      </td>
                    </tr>
                  ))}

                {/* Fila de total */}
                <tr className="border-t-2 border-gray-300 font-bold bg-gray-100">
                  <td colSpan={3} className="py-2 px-4 text-right">
                    Área Total:
                  </td>
                  <td className="py-2 px-4 text-right">
                    {(
                      selectedLots
                        .filter((lot) => {
                          // Si tiene sublotes y área 0, no lo contamos
                          const hasChildSublots = selectedSublots.some(
                            (sublot) => sublot.id_parent_lote === lot.rowid
                          );
                          return !(hasChildSublots && lot.area_utilizada === 0);
                        })
                        .reduce((sum, lot) => sum + lot.area_utilizada, 0) +
                      selectedSublots.reduce(
                        (sum, sublot) => sum + sublot.area_utilizada,
                        0
                      )
                    ).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {hours && hours.length > 0 && (
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
                  <th className="py-2 px-4 text-right">
                    Consumo de Combustible
                  </th>
                  <th className="py-2 px-4 text-right">
                    Costo de Combustible
                  </th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {hours.map((hour) => (
                  <tr key={hour.rowid} className="border-b">
                    <td className="py-2 px-4">{formatDate(hour.date)}</td>
                    <td className="py-2 px-4 text-right">{hour.hours}</td>
                    <td className="py-2 px-4 text-right">
                      {Number(
                        hour.fuel_consumption_per_hour * hour.hours
                      ).toFixed(2)}
                    </td>
                    <td className="py-2 px-4 text-right">
                      ${Number(hour.fuel_price).toLocaleString()}
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

      {fertirriego && fertirriego.length > 0 && (
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
                  <th className="py-2 px-4 text-right">
                    Cantidad de Productos
                  </th>
                  <th className="py-2 px-4 text-right">Costo Total</th>
                  <th className="py-2 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {fertirriego.map((fert) => (
                  <>
                    <tr key={fert.rowid} className="border-b">
                      <td className="py-2 px-4">{formatDate(fert.date)}</td>
                      <td className="py-2 px-4 text-right">
                        {fert.total_area.toFixed(2)}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {fert.product_count}
                      </td>
                      <td className="py-2 px-4 text-right">
                        ${Number(fert.total_cost).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            const detailRow = document.getElementById(
                              `fert-detail-${fert.rowid}`
                            );
                            if (detailRow) {
                              detailRow.classList.toggle("hidden");
                            }
                          }}
                        >
                          Ver productos
                        </button>
                      </td>
                    </tr>
                    <tr
                      id={`fert-detail-${fert.rowid}`}
                      className="hidden bg-gray-50"
                    >
                      <td colSpan={5} className="py-2 px-4">
                        <div className="p-3">
                          <h4 className="font-medium mb-2">
                            Productos utilizados:
                          </h4>
                          <table className="min-w-full bg-white border">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="py-1 px-3 text-left text-sm">
                                  Producto
                                </th>
                                <th className="py-1 px-3 text-left text-sm">
                                  Referencia
                                </th>
                                <th className="py-1 px-3 text-left text-sm">
                                  Almacén
                                </th>
                                <th className="py-1 px-3 text-right text-sm">
                                  Cantidad
                                </th>
                                <th className="py-1 px-3 text-left text-sm">
                                  Tipo
                                </th>
                                <th className="py-1 px-3 text-right text-sm">
                                  Precio Total
                                </th>
                                <th className="py-1 px-3 text-center">
                                  Acciones
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {fert.products &&
                                fert.products.map((product, idx) => (
                                  <tr key={idx} className="border-t">
                                    <td className="py-1 px-3 text-sm">
                                      {product.product_name}
                                    </td>
                                    <td className="py-1 px-3 text-sm">
                                      {product.product_ref}
                                    </td>
                                    <td className="py-1 px-3 text-sm">
                                      {product.warehouse_name}
                                    </td>
                                    <td className="py-1 px-3 text-right text-sm">
                                      {product.quantity}
                                    </td>
                                    <td className="py-1 px-3 text-sm">
                                      {product.type}
                                    </td>
                                    <td className="py-1 px-3 text-right text-sm">
                                      ${product.total_price.toLocaleString()}
                                    </td>
                                    <td className="py-1 px-3 text-center">
                                      <button
                                        title="Eliminar"
                                        className="text-red-600 hover:text-red-800"
                                        onClick={() =>
                                          handleDeleteFertirriegoProduct(
                                            product.rowid || ""
                                          )
                                        }
                                      >
                                        <i className="fa-solid fa-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              {(!fert.products ||
                                fert.products.length === 0) && (
                                <tr>
                                  <td
                                    colSpan={6}
                                    className="py-2 px-3 text-center text-sm"
                                  >
                                    No hay productos registrados
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {materials.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-zinc-700 border-b pb-2">
            Materiales
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 text-left">Producto</th>
                  <th className="py-2 px-4 text-left">Referencia</th>
                  <th className="py-2 px-4 text-left">Almacén</th>
                  <th className="py-2 px-4 text-right">Cantidad</th>
                  <th className="py-2 px-4 text-left">Tipo</th>
                  <th className="py-2 px-4 text-right">Precio Total</th>
                </tr>
              </thead>
              <tbody>
                {materials.map((material, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">{material.product_name}</td>
                    <td className="py-2 px-4">{material.product_ref}</td>
                    <td className="py-2 px-4">{material.warehouse_name}</td>
                    <td className="py-2 px-4 text-right">
                      {material.quantity}
                    </td>
                    <td className="py-2 px-4">{material.type}</td>
                    <td className="py-2 px-4 text-right">
                      ${material.total_price.toLocaleString()}
                    </td>
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
