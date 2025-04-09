import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { generateFieldLotCode } from "../../../../helpers";
import {
  CropForm,
  FieldEntity,
  CropLot,
} from "../../../../interfaces";
import { useCrop, useField } from "../../../../hooks";
import { FormField } from "../../../../ui/components";

export const FormCrop = () => {
  // Get the createCrop mutation (update functionality removed)
  const { createCrop } = useCrop();
  const { mutate: createCropMutation } = createCrop;

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
  } = useForm<CropForm>();

  // Local states
  const [selectedFieldName, setSelectedFieldName] = useState<string>("");
  const [selectedLots, setSelectedLots] = useState<CropLot[]>([]);
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

  // Generate the crop code using helper function
  useEffect(() => {
    const codeString = generateFieldLotCode(
      selectedFieldName,
      selectedCultivo,
      selectedPeriod,
      selectedYear
    );
    setValue("code", codeString);
  }, [selectedFieldName, selectedCultivo, selectedPeriod, selectedYear, setValue]);

  // Retrieve available lots based on the selected field
  const { getLotByField } = useField(undefined, selectedField);
  const { data: lotData } = getLotByField;
  useEffect(() => {
    if (selectedField) {
      getLotByField.refetch();
    }
  }, [selectedField, getLotByField]);

  // Update the used area for a lot (checks if it exceeds the available area)
  const handleLotAreaChange = (lotId: string, area: number) => {
    const lot = lotData?.find((l) => l.rowid === lotId);
    if (lot && area > Number(lot.area_real)) {
      toast.error(`El área no puede ser mayor a ${lot.area_real}`);
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

  // Handle sublot addition:
  // - Disables the "use max area" option
  // - Resets the lot's used area to 0
  // - Adds the sublot to the list of sublots for that lot
  const handleSubLotChange = (lotId: string) => {
    const currentInput = subLotInputs[lotId];
    if (currentInput && currentInput.name && currentInput.area_utilizada > 0) {
      // Disable "use max area" for this lot
      setMaxAreaChecked((prev) => ({ ...prev, [lotId]: false }));
      // Reset the lot's used area to 0
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
    const formData = {
      ...data,
      lots: selectedLots,
    };

    // Transform sublots data into an array
    const subLots = Object.entries(addedSubLots).flatMap(([lotId, sublots]) =>
      sublots.map(({ name, area_utilizada }) => ({
        id_parent_lot: lotId,
        name,
        area_utilizada,
      }))
    );
    formData.sub_lots = subLots;
  
    createCropMutation(formData, {
      onSuccess: () => {
        navigate("/crop/list");
        reset();
      },
      onError: (error) => {
        toast.error("Error creating crop: " + error);
      },
    });
  });

  const navigate = useNavigate();

  if (isLoadingField) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Cultivo</h1>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
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
              <div className="space-y-3">
                {lotData.map((lot) => (
                  <div
                    key={lot.rowid}
                    className="flex flex-col p-4 border border-gray-200 rounded-md bg-white shadow-sm hover:border-gray-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      {/* Lot selection */}
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedLots.some((l) => l.id_lote === lot.rowid)}
                          onChange={(e) => handleLotSelection(lot.rowid, e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
                          aria-label={`Select lot ${lot.name}`}
                        />
                        <span className="font-medium text-gray-700">{lot.name}</span>
                      </div>
                      {/* Sublot inputs and max area checkbox */}
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <input
                            value={subLotInputs[lot.rowid]?.name || ""}
                            onChange={(e) =>
                              setSubLotInputs((prev) => ({
                                ...prev,
                                [lot.rowid]: {
                                  ...prev[lot.rowid],
                                  name: e.target.value,
                                  area_utilizada: prev[lot.rowid]?.area_utilizada || 0,
                                },
                              }))
                            }
                            type="text"
                            placeholder="Sublote"
                            className="w-32 px-3 py-2 mx-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
                          />
                          <input
                            value={subLotInputs[lot.rowid]?.area_utilizada || ""}
                            onChange={(e) =>
                              setSubLotInputs((prev) => ({
                                ...prev,
                                [lot.rowid]: {
                                  ...prev[lot.rowid],
                                  name: prev[lot.rowid]?.name || "",
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
                            onClick={() => handleSubLotChange(lot.rowid)}
                          >
                            Agregar sublote
                          </button>
                        </div>
                        {addedSubLots[lot.rowid]?.length > 0 && (
                          <div className="ml-4">
                            <h4 className="font-medium mb-2">Added Sublots:</h4>
                            <ul className="space-y-2">
                              {addedSubLots[lot.rowid].map((sublot, index) => (
                                <li key={index} className="text-sm text-gray-600">
                                  {sublot.name} - {sublot.area_utilizada} ha
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                          Max: {lot.area_real}
                        </span>
                        <input
                          title="Usar área máxima"
                          type="checkbox"
                          checked={maxAreaChecked[lot.rowid] || false}
                          onChange={(e) => {
                            const useMax = e.target.checked;
                            setMaxAreaChecked((prev) => ({ ...prev, [lot.rowid]: useMax }));
                            // Remove previously added sublots for this lot
                            setAddedSubLots((prev) => {
                              const newAdded = { ...prev };
                              delete newAdded[lot.rowid];
                              return newAdded;
                            });
                            handleLotAreaChange(lot.rowid, useMax ? +lot.area_real : 0);
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-sm hover:bg-zinc-900 focus:outline-none transition-colors"
              >
                Create Crop
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
