import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { generateFieldLotCode } from "../../../../helpers";
import {
  CropForm,
  FieldEntity,
} from "../../../../interfaces";
import { useCrop, useField } from "../../../../hooks";
import { FormField } from "../../../../ui/components";

// Local UI form type to align inputs (strings) with API (numbers)
type CropFormUI = Omit<CropForm, 'codigo_campo' | 'status' | 'lots' | 'sub_lots'> & {
  codigo_campo: string;
  status: string;
  lots: Array<{ id_lote: string; area_utilizada: number }>;
  sub_lots?: Array<{ id_parent_lot: string; name: string; area_utilizada: number }>;
};

export const FormCrop = () => {
  const { code } = useParams(); // This is actually rowid for get operation
  const isEditMode = !!code;
  
  // Get the createCrop and updateCrop mutations
  // For get operation, we pass the rowid (which comes as 'code' param)
  const { createCrop, updateCrop, getCrop } = useCrop(code);
  const { mutate: createCropMutation } = createCrop;
  const { mutate: updateCropMutation } = updateCrop;
  
  // Get crop data for edit mode
  const { data: cropData, isLoading: isLoadingCrop } = getCrop;

  // Get fields data
  const { getFields } = useField();
  const { data: fieldsData, isLoading: isLoadingField } = getFields;

  console.log(fieldsData, "fieldsData");

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CropFormUI>();

  // Local states
  const [selectedFieldName, setSelectedFieldName] = useState<string>("");
  const [selectedLots, setSelectedLots] = useState<Array<{id_lote: string, area_utilizada: number}>>([]);
  // State to control "use max area" checkboxes per lot
  const [maxAreaChecked, setMaxAreaChecked] = useState<{ [key: string]: boolean }>({});

  // For each lot, control the input values for the sublot
  const [subLotInputs, setSubLotInputs] = useState<{
    [lotId: string]: { name: string; area_utilizada: number };
  }>({});
  // Store added sublots per lot
  const [addedSubLots, setAddedSubLots] = useState<{
    [lotId: string]: Array<{ name: string; area_utilizada: number }>;
  }>({});

  // Get values from the form to generate a code
  const selectedField = watch("codigo_campo");
  const selectedCultivo = watch("cultivo");
  const selectedPeriod = watch("periodo");
  const selectedYear = watch("anio");

  // Generate the crop code using helper function (only for create mode)
  useEffect(() => {
    if (!isEditMode) {
      const codeString = generateFieldLotCode(
        selectedFieldName,
        selectedCultivo,
        selectedPeriod,
        selectedYear
      );
      setValue("code", codeString);
    }
  }, [selectedFieldName, selectedCultivo, selectedPeriod, selectedYear, setValue, isEditMode]);

  // Populate form with existing crop data in edit mode
  useEffect(() => {
    if (isEditMode && cropData && fieldsData) {
      // Set basic form fields
      setValue("code", cropData.code || "");
      setValue("codigo_campo", cropData.codigo_campo ? cropData.codigo_campo.toString() : "");
      setValue("cultivo", cropData.cultivo || "");
      setValue("periodo", cropData.periodo || "");
      setValue("anio", cropData.anio || "");
      setValue("etapa", cropData.etapa || "");
      setValue("description", cropData.description || "");
      setValue("status", cropData.status ?? "1");
      
      // Set field name for code generation
      const field = fieldsData.find((f) => f.rowid === String(cropData.codigo_campo ?? ""));
      if (field) {
        setSelectedFieldName(field.name);
      }
      
      // Set existing lots if available
      if (cropData.lots && Array.isArray(cropData.lots) && cropData.lots.length > 0) {
        const lots = cropData.lots
          .filter(lot => lot && lot.id_lote) // Filter out invalid lots
          .map(lot => ({
            id_lote: lot.id_lote.toString(), // Keep as string for form handling
            area_utilizada: lot.area_utilizada || 0
          }));
        setSelectedLots(lots);
        
        // Set existing sublots if available
        const sublots: { [lotId: string]: Array<{ name: string; area_utilizada: number }> } = {};
        const maxAreaStates: { [key: string]: boolean } = {};
        
        cropData.lots.forEach(lot => {
          const lotId = lot.id_lote.toString();
          
          // Check if this lot is using max area (comparing with available lotData when it's loaded)
          if (lot.sub_lots && Array.isArray(lot.sub_lots) && lot.sub_lots.length > 0) {
            sublots[lotId] = lot.sub_lots.map(sublot => ({
              name: sublot.name,
              area_utilizada: sublot.area_utilizada
            }));
            maxAreaStates[lotId] = false; // Has sublots, so not using max area
          } else {
            // No sublots, check if using max area (will be determined when lotData is available)
            maxAreaStates[lotId] = false; // Default to false, will be updated when lotData loads
          }
        });
        
        setAddedSubLots(sublots);
        setMaxAreaChecked(maxAreaStates);
      }
    }
  }, [isEditMode, cropData, fieldsData, setValue]);

  // Retrieve available lots based on the selected field
  const { getLotByField } = useField(undefined, selectedField || undefined);
  const { data: lotData } = getLotByField;
  useEffect(() => {
    if (selectedField) {
      getLotByField.refetch();
    }
  }, [selectedField, getLotByField]);

  // Update max area states when lot data is available and we have selected lots from edit mode
  useEffect(() => {
    if (isEditMode && lotData && selectedLots.length > 0) {
      const updatedMaxAreaStates: { [key: string]: boolean } = {};
      
      selectedLots.forEach(selectedLot => {
        const lotInfo = lotData.find(lot => lot.rowid === selectedLot.id_lote);
        if (lotInfo) {
          // Check if the selected area equals the lot's max area and there are no sublots
          const hasSubLots = addedSubLots[selectedLot.id_lote]?.length > 0;
          const isUsingMaxArea = !hasSubLots && selectedLot.area_utilizada === Number(lotInfo.area_real);
          updatedMaxAreaStates[selectedLot.id_lote] = isUsingMaxArea;
        }
      });
      
      setMaxAreaChecked(prev => ({ ...prev, ...updatedMaxAreaStates }));
    }
  }, [isEditMode, lotData, selectedLots, addedSubLots]);

  // Update the used area for a lot (checks if it exceeds the available area)
  const handleLotAreaChange = (lotId: string, area: number) => {
    const lot = lotData?.find((l) => l.rowid.toString() === lotId);
    if (!lot) return;

    // If there are sublots, don't allow direct area (they should manage area through sublots)
    const hasSubLots = addedSubLots[lotId]?.length > 0;
    if (hasSubLots && area > 0) {
      toast.error("No puede asignar área directa cuando hay sublotes. Gestione el área a través de los sublotes.");
      return;
    }

    // Validate area limit
    if (!validateAreaLimit(lotId, area, false)) {
      const currentSublotsArea = addedSubLots[lotId]?.reduce((sum, sublot) => sum + sublot.area_utilizada, 0) || 0;
      const remaining = Number(lot.area_real) - currentSublotsArea;
      toast.error(`Área excede el límite. Área máxima: ${lot.area_real} ha. Área disponible: ${remaining.toFixed(2)} ha`);
      return;
    }

    setSelectedLots((prev) =>
      prev.some((l) => l.id_lote === lotId)
        ? prev.map((l) => (l.id_lote === lotId ? { ...l, area_utilizada: area } : l))
        : [...prev, { id_lote: lotId, area_utilizada: area }]
    );
  };

  // Handle lot selection (add or remove from the selected list)
  const handleLotSelection = (lotId: string, checked: boolean) => {
    if (checked) {
      setSelectedLots((prev) => [
        ...prev,
        { id_lote: lotId, area_utilizada: 0 },
      ]);
    } else {
      setSelectedLots((prev) => prev.filter((l) => l.id_lote !== lotId));
    }
  };

  // Calculate total area used for a lot (direct area + sublots area)
  const calculateTotalAreaUsed = (lotId: string) => {
    const directArea = selectedLots.find(l => l.id_lote === lotId)?.area_utilizada || 0;
    const sublotsArea = addedSubLots[lotId]?.reduce((sum, sublot) => sum + sublot.area_utilizada, 0) || 0;
    return directArea + sublotsArea;
  };

  // Check if adding area would exceed lot's maximum
  const validateAreaLimit = (lotId: string, newArea: number, isSubLot: boolean = false) => {
    const lot = lotData?.find((l) => l.rowid.toString() === lotId);
    if (!lot) return false;

    const currentDirectArea = selectedLots.find(l => l.id_lote === lotId)?.area_utilizada || 0;
    const currentSublotsArea = addedSubLots[lotId]?.reduce((sum, sublot) => sum + sublot.area_utilizada, 0) || 0;
    
    let totalArea;
    if (isSubLot) {
      totalArea = currentDirectArea + currentSublotsArea + newArea;
    } else {
      totalArea = newArea + currentSublotsArea;
    }

    return totalArea <= Number(lot.area_real);
  };

  // Handle sublot addition with validation
  const handleSubLotChange = (lotId: string) => {
    const currentInput = subLotInputs[lotId];
    if (currentInput && currentInput.name && currentInput.area_utilizada > 0) {
      // Validate area limit
      if (!validateAreaLimit(lotId, currentInput.area_utilizada, true)) {
        const lot = lotData?.find((l) => l.rowid.toString() === lotId);
        const totalUsed = calculateTotalAreaUsed(lotId);
        const remaining = Number(lot?.area_real || 0) - totalUsed;
        toast.error(`Área excede el límite. Área máxima: ${lot?.area_real} ha. Área disponible: ${remaining.toFixed(2)} ha`);
        return;
      }

      // Disable "use max area" for this lot
      setMaxAreaChecked((prev) => ({ ...prev, [lotId]: false }));
      // Reset the lot's used area to 0 if there are sublots
      handleLotAreaChange(lotId, 0);
      // Add the sublot
      setAddedSubLots((prev) => ({
        ...prev,
        [lotId]: [...(prev[lotId] || []), { ...currentInput }],
      }));
      // Clear the input for this lot
      setSubLotInputs((prev) => ({ ...prev, [lotId]: { name: "", area_utilizada: 0 } }));
    } else {
      toast.error("Por favor, ingrese el nombre del sublote y el área");
    }
  };

  // On form submission, compile the crop data along with lots and sublots
  const onSubmit = handleSubmit((data) => {
    // Validate that no lot exceeds its maximum area
    const invalidLots = selectedLots.filter(selectedLot => {
      const totalUsed = calculateTotalAreaUsed(selectedLot.id_lote);
      const lot = lotData?.find((l) => l.rowid.toString() === selectedLot.id_lote);
      return lot && totalUsed > Number(lot.area_real);
    });

    if (invalidLots.length > 0) {
      toast.error("Algunos lotes exceden su área máxima. Por favor, corrija antes de continuar.");
      return;
    }

    // Build API payload with proper data types according to API specification
    const apiData: CropForm = {
      code: data.code,
      codigo_campo: parseInt(data.codigo_campo),
      cultivo: data.cultivo,
      periodo: data.periodo,
      anio: data.anio,
      etapa: data.etapa,
      description: data.description,
      status: parseInt(data.status),
      lots: selectedLots.map(lot => ({
        id_lote: parseInt(lot.id_lote),
        area_utilizada: parseFloat(lot.area_utilizada.toString())
      })),
    };

    // Transform sublots data into an array with proper types
    const subLots = Object.entries(addedSubLots).flatMap(([lotId, sublots]) =>
      sublots.map(({ name, area_utilizada }) => ({
        id_parent_lot: parseInt(lotId),
        name,
        area_utilizada: parseFloat(area_utilizada.toString())
      }))
    );
    if (subLots.length > 0) {
      apiData.sub_lots = subLots;
    }
  
    // Debug: Log the data being sent
    console.log("=== FORM DATA BEING SENT ===");
    console.log("Is Edit Mode:", isEditMode);
    console.log("URL Param (rowid for get):", code);
    console.log("Crop Data code (for update):", cropData?.code);
    console.log("Form Data:", JSON.stringify(apiData, null, 2));
    console.log("Selected Lots:", selectedLots);
    console.log("Added SubLots:", addedSubLots);
    console.log("================================");
  
     if (isEditMode && cropData?.code) {
       updateCropMutation({ code: cropData.code, data: apiData }, {
        onSuccess: () => {
          navigate("/crop/list");
        },
        onError: (error) => {
          console.error("Update Error:", error);
          toast.error("Error al actualizar el cultivo: " + error);
        },
      });
    } else {
      createCropMutation(apiData, {
        onSuccess: () => {
          navigate("/crop/list");
          reset();
        },
        onError: (error) => {
          toast.error("Error al crear el cultivo: " + error);
        },
      });
    }
  });

  const navigate = useNavigate();

  if (isLoadingField || (isEditMode && isLoadingCrop)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {isEditMode ? "Editar Cultivo" : "Crear Cultivo"}
      </h1>
      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4">
          {/* Basic Information Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-zinc-800">Información básica</h2>
          </div>
          
          <FormField label="Código" error={errors.code?.message || ""} required>
            <input
              {...register("code")}
              name="code"
              placeholder="ABC123"
              type="text"
              autoComplete="off"
              disabled={isEditMode}
              className={`w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800 ${isEditMode ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />
          </FormField>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Campo <span className="text-red-500">*</span>
            </label>
            <select
              {...register("codigo_campo", { required: "Este campo es requerido" })}
              name="codigo_campo"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              onChange={(e) => {
                const field = fieldsData?.find((f) => f.rowid === e.target.value);
                setSelectedFieldName(field?.name || "");
                register("codigo_campo").onChange(e);
              }}
            >
              <option value="">Seleccionar Campo</option>
              {fieldsData?.map((field: FieldEntity) => (
                <option key={field.rowid} value={field.rowid}>
                  {field.name}
                </option>
              ))}
            </select>
            {errors.codigo_campo && (
              <p className="text-red-500 text-sm mt-1">{errors.codigo_campo.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cultivo <span className="text-red-500">*</span>
            </label>
            <input
              {...register("cultivo", { required: "Este campo es requerido" })}
              name="cultivo"
              placeholder="Papa"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.cultivo && (
              <p className="text-red-500 text-sm mt-1">{errors.cultivo.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Periodo <span className="text-red-500">*</span>
            </label>
            <input
              {...register("periodo", { required: "Este campo es requerido" })}
              name="periodo"
              placeholder="Primavera"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.periodo && (
              <p className="text-red-500 text-sm mt-1">{errors.periodo.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año <span className="text-red-500">*</span>
            </label>
            <input
              {...register("anio", { required: "Este campo es requerido" })}
              name="anio"
              placeholder="2025"
              type="number"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.anio && (
              <p className="text-red-500 text-sm mt-1">{errors.anio.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etapa
            </label>
            <input
              {...register("etapa")}
              name="etapa"
              placeholder="Temprana"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.etapa && (
              <p className="text-red-500 text-sm mt-1">{errors.etapa.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción/Observaciones
            </label>
            <textarea
              {...register("description")}
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status")}
              name="status"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>

          {/* Lots and Sublots Section */}
          <div className="col-span-2 mb-4">
            <h2 className="text-xl font-semibold mb-4 text-zinc-800">Lotes utilizados</h2>
            {lotData && lotData.length > 0 ? (
              <div className="space-y-4">
                {lotData.map((lot) => {
                  const lotId = lot.rowid.toString();
                  const isSelected = selectedLots.some((l) => l.id_lote === lotId);
                  const selectedLot = selectedLots.find(l => l.id_lote === lotId);
                  const isMaxAreaChecked = maxAreaChecked[lotId] || false;
                  
                  return (
                    <div
                      key={lot.rowid}
                      className="flex flex-col p-4 border border-gray-200 rounded-md bg-white shadow-sm hover:border-gray-300 transition-all"
                    >
                      {/* Header del lote */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => handleLotSelection(lotId, e.target.checked)}
                              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label={`Select lot ${lot.name}`}
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900 text-lg">{lot.name}</h3>
                              <p className="text-sm text-gray-500">Área disponible: {lot.area_real} ha</p>
                            </div>
                          </div>
                          
                          {/* Keep header minimal and consistent with common components */}
                        </div>
                      </div>

                      {/* Contenido del lote - solo visible si está seleccionado */}
                      {isSelected && (
                        <div className="flex items-center gap-4 mt-4">
                          <div className="relative">
                            <input
                              title="Usar área máxima"
                              type="checkbox"
                              checked={isMaxAreaChecked}
                              onChange={(e) => {
                                const useMax = e.target.checked;
                                setMaxAreaChecked((prev) => ({ ...prev, [lotId]: useMax }));
                                setAddedSubLots((prev) => {
                                  const newAdded = { ...prev };
                                  delete newAdded[lotId];
                                  return newAdded;
                                });
                                handleLotAreaChange(lotId, useMax ? +lot.area_real : 0);
                              }}
                              className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
                            />
                            <label className="ml-2 text-sm text-gray-700">
                              Usar área máxima (Max: {lot.area_real})
                            </label>
                          </div>
                          {!isMaxAreaChecked && (
                            <>
                              <input
                                type="number"
                                value={selectedLot?.area_utilizada || ''}
                                onChange={(e) => handleLotAreaChange(lotId, Number(e.target.value))}
                                placeholder="0"
                                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
                                min="0"
                                max={lot.area_real}
                                step="0.01"
                              />
                              <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                                Max: {lot.area_real}
                              </span>
                            </>
                          )}
                          {/* Sublotes */}
                          <div className="flex items-center gap-2">
                            <input
                              value={subLotInputs[lotId]?.name || ''}
                              onChange={(e) =>
                                setSubLotInputs((prev) => ({
                                  ...prev,
                                  [lotId]: {
                                    ...prev[lotId],
                                    name: e.target.value,
                                    area_utilizada: prev[lotId]?.area_utilizada || 0,
                                  },
                                }))
                              }
                              type="text"
                              placeholder="Sublote"
                              className="w-32 px-3 py-2 mx-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
                            />
                            <input
                              value={subLotInputs[lotId]?.area_utilizada || ''}
                              onChange={(e) =>
                                setSubLotInputs((prev) => ({
                                  ...prev,
                                  [lotId]: {
                                    ...prev[lotId],
                                    name: prev[lotId]?.name || '',
                                    area_utilizada: Number(e.target.value),
                                  },
                                }))
                              }
                              type="number"
                              placeholder="0"
                              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
                              min="0"
                              max={lot.area_real}
                              step="0.01"
                            />
                            <button
                              type="button"
                              className="bg-zinc-800 text-white px-4 py-2 mx-2 rounded-md"
                              onClick={() => handleSubLotChange(lotId)}
                            >
                              Agregar sublote
                            </button>
                          </div>
                          {addedSubLots[lotId]?.length > 0 && (
                            <div className="ml-4">
                              <h4 className="font-medium mb-2">Sublotes agregados:</h4>
                              <ul className="space-y-2">
                                {addedSubLots[lotId].map((sublot, index) => (
                                  <li key={index} className="text-sm text-gray-600">
                                    {sublot.name} - {sublot.area_utilizada} ha
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-md">
                Seleccione un campo para ver los lotes disponibles
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-8">
              <button
                type="button"
                onClick={() => navigate("/crop/list")}
                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 focus:outline-none transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-sm hover:bg-zinc-900 focus:outline-none transition-colors"
              >
                {isEditMode ? "Actualizar Cultivo" : "Crear Cultivo"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
