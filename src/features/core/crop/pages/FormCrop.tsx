import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from 'react-router-dom';
import { generateFieldLotCode } from '../../../../helpers';
import { CropForm, FieldEntity, CropLot, CropLotResponse } from "../../../../interfaces";

import { useCrop, useField } from "../../../../hooks";

export const FormCrop = () => {
    const { code } = useParams();
    const { createCrop, updateCrop, getCrop } = useCrop(code);

    const { mutate: createCropMutation } = createCrop;
    const { mutate: updateCropMutation } = updateCrop;
    const { data: cropData, isLoading: isLoadingCrop } = getCrop;

    // Get fields
    const { getFields } = useField();
    const { data: fieldsData, isLoading: isLoadingField } = getFields;

    // Form
    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<CropForm>();

    // Add a state to store the selected field name
    const [selectedFieldName, setSelectedFieldName] = useState<string>('');

    // Añade este estado para manejar los lotes seleccionados
    const [selectedLots, setSelectedLots] = useState<CropLot[]>([]);

    const [selectedUpdateLots, setSelectedUpdateLots] = useState<CropLotResponse[]>([]);

    //!Create field lot
    
    // Create code
    const selectedField = watch('codigo_campo');
    const selectedCultivo = watch('cultivo');
    const selectedPeriod = watch('periodo');
    const selectedYear = watch('anio');

    useEffect(() => {
        const codeString = generateFieldLotCode(
            selectedFieldName,
            selectedCultivo,
            selectedPeriod,
            selectedYear
        );
        setValue('code', codeString);
    }, [selectedField, selectedCultivo, selectedPeriod, selectedYear, setValue]);


    // Retrive lot of field
    const { getLotByField } = useField(undefined, selectedField);
    const { data: lotData } = getLotByField;

    useEffect(() => {
        if (selectedField !== '' && selectedField !== undefined) {
            getLotByField.refetch();
        }
    }, [ selectedField ]);


    //!Update field lot
    // Add this effect after the existing useEffect
    useEffect(() => {
        if (cropData && code) {
            Object.entries(cropData).forEach(([key, value]) => {
                setValue(key as keyof CropForm, value as string | number);
            });

            const field = fieldsData?.find(f => f.rowid === cropData.codigo_campo);
            setSelectedFieldName(field?.name || '');

            // Inicializar tanto selectedUpdateLots como selectedLots
            if (cropData.lots) {
                const existingLots = cropData.lots.map((lot: CropLotResponse) => ({
                    id_lote: lot.id_lote,
                    area_utilizada: lot.area_utilizada,
                    name: lot.name,
                    area_total: lot.area_total,
                    campo_name: lot.campo_name
                }));
                setSelectedUpdateLots(existingLots);
                setSelectedLots([]); // Inicializar selectedLots vacío para nuevas selecciones
            }
        }
    }, [cropData, code, setValue, fieldsData]);

    // Funciones para manejar los lotes
    const handleLotAreaChange = (lotId: string, area: number) => {
        const lot = lotData?.find(l => l.rowid === lotId);
        if (lot && +area > +lot.area_real) {
            toast.error(`El área no puede ser mayor a ${lot.area_real}`);
            return;
        }

        setSelectedLots(prev => {
            const existing = prev.find(l => l.id_lote === lotId);
            if (existing) {
                return prev.map(l => l.id_lote === lotId ? { ...l, area_utilizada: area } : l);
            }
            return [...prev, { id_lote: lotId, area_utilizada: area }];
        });
    };

    const handleLotSelection = (lotId: string, checked: boolean) => {
        // Verificar si es un lote existente en la base de datos
        const isExistingFromDB = code && cropData?.lots?.some(
            (l: CropLotResponse) => l.id_lote?.toString() === lotId?.toString()
        );
        
        // Si no es un lote existente en la DB, permitir la selección/deselección
        if (!isExistingFromDB) {
            if (checked) {
                setSelectedLots(prev => [...prev, { id_lote: lotId, area_utilizada: 0 }]);
            } else {
                setSelectedLots(prev => prev.filter(l => l.id_lote !== lotId));
            }
        }
    };

    //!Form submit
    const onSubmit = handleSubmit((data) => {
        const formData = {
            ...data,
            lots: code 
                ? [...selectedUpdateLots, ...selectedLots] // Combinar lotes existentes y nuevos
                : selectedLots
        };
        

        if (code) {

            updateCropMutation({ 
                code, 
                data: formData,
            }, {
                onSuccess: () => {
                    navigate('/crop/list');
                    reset();
                }
            });
        } else {
            createCropMutation(formData, {
                onSuccess: () => {
                    navigate('/crop/list');
                    reset();
                },
                onError: (error) => {
                    toast.error('Error al crear el cultivo: ' + error);
                }
            });
        }
    });

    // Navigation when creating or updating
    const navigate = useNavigate();

    // // Carga de la cusa
    if (isLoadingCrop || isLoadingField) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    // Renderizado
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                {code ? 'Actualizar cultivo' : 'Crear cultivo'}
            </h1>

            <form onSubmit={onSubmit} className="w-full">
                <div className="w-full grid grid-cols-2 gap-4">
                    {/* Basic Information Section */}
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-zinc-800">Información Básica</h2>
                    </div>

                    {/* Code Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Código <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('code')}
                            name="code"
                            placeholder="ABC123"
                            type="text"
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.code && (
                            <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
                        )}
                    </div>

                     {/* Name Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Campo <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('codigo_campo', {
                                required: 'Este campo es requerido',
                            })}
                            name="codigo_campo"
                            disabled={!!code}
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                            onChange={(e) => {
                                const field = fieldsData?.find(f => f.rowid === e.target.value);
                                setSelectedFieldName(field?.name || '');
                                register('codigo_campo').onChange(e); // Maintain react-hook-form functionality
                            }}
                        >
                            <option value="">Seleccione un campo</option>
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

                    {/* Cultivo Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cultivo <span className="text-red-500">*</span>
                        </label>
                        <input
                        {...register('cultivo', {
                            required: 'Este campo es requerido',
                        })}
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

                    {/* Period */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Periodo <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('periodo', {
                                required: 'Este campo es requerido',
                            })}
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

                   {/* Year */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Año
                        </label>
                        <input
                            {...register('anio', {
                                required: 'Este campo es requerido',
                            })}
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

                    {/* Stage */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Etapa
                        </label>
                        <input
                            {...register('etapa')}
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

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción u observaciones
                        </label>
                        <textarea
                            {...register('description',)}
                            name="description"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/*Status*/}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Estado
                        </label>
                        <select
                            {...register('status')}
                            name="status"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        >
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                        </select>
                    </div>
            

                    {/* Añade esta sección antes de los botones */}
                    <div className="col-span-2 mb-4">
                        <h2 className="text-xl font-semibold mb-4 text-zinc-800">Lotes Utilizados</h2>
                        {lotData && lotData.length > 0 ? (
                            <div className="space-y-3">
                                {lotData.map((lot) => {
                                    // Verificar si es un lote existente en la DB
                                    const isExistingFromDB = code && cropData?.lots?.some(
                                        (l: CropLotResponse) => l.id_lote?.toString() === lot.rowid?.toString()
                                    );

                                    // Buscar el lote en los lotes existentes o nuevos
                                    const existingLot = isExistingFromDB
                                        ? selectedUpdateLots.find(l => l.id_lote === lot.rowid)
                                        : selectedLots.find(l => l.id_lote === lot.rowid);

                                    // Obtener el área utilizada
                                    const existingArea = isExistingFromDB
                                        ? cropData?.lots?.find((l: CropLotResponse) => 
                                            l.id_lote?.toString() === lot.rowid?.toString()
                                          )?.area_utilizada
                                        : existingLot?.area_utilizada;

                                    return (
                                        <div key={lot.rowid} className="flex items-center gap-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm hover:border-gray-300 transition-all">
                                            <input
                                                type="checkbox"
                                                checked={!!existingLot || isExistingFromDB}
                                                onChange={(e) => handleLotSelection(lot.rowid, e.target.checked)}
                                                disabled={isExistingFromDB}
                                                className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
                                                aria-label={`Seleccionar lote ${lot.name}`}
                                            />
                                            <span className="flex-1 font-medium text-gray-700">{lot.name}</span>
                                            {(existingLot || isExistingFromDB) && (
                                                <div className="flex items-center gap-4">
                                                    <div className="relative">
                                                        <input
                                                            type="number"
                                                            value={existingArea || ''}
                                                            onChange={(e) => !isExistingFromDB && handleLotAreaChange(lot.rowid, Number(e.target.value))}
                                                            placeholder="0"
                                                            className={`w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800 ${isExistingFromDB ? 'bg-gray-100' : ''}`}
                                                            min="0"
                                                            max={lot.area_real}
                                                            step="0.01"
                                                            disabled={isExistingFromDB}
                                                        />
                                                    </div>
                                                    {!isExistingFromDB && (
                                                        <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
                                                            <input
                                                                type="checkbox"
                                                                aria-label="Usar área máxima del lote"
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        handleLotAreaChange(lot.rowid, Number(lot.area_real));
                                                                    }
                                                                }}
                                                                className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
                                                            />
                                                            <label className="text-sm text-gray-600 select-none">
                                                                Usar máximo
                                                            </label>
                                                        </div>
                                                    )}
                                                    <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
                                                        Máx: {lot.area_real}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 italic text-center py-8 bg-gray-50 rounded-md">
                                Seleccione un campo para ver sus lotes disponibles
                            </p>
                        )}
                    </div>

                    {/* Buttons Section */}
                    <div className="col-span-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate('/crop/list')}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 focus:outline-none transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-zinc-800 text-white rounded-sm hover:bg-zinc-900 focus:outline-none transition-colors"
                            >
                                {code ? 'Actualizar cultivo' : 'Crear cultivo'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

        </div>
    )
}