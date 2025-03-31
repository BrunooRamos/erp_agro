import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';

import {  useField } from "../../../../hooks";
import { FieldForm } from "../../../../interfaces";
import { RENT_PERIODS } from "../constants/rent_periods";
import { FormField as FormFieldUI, MapPolygon } from "../../../../ui/components/index";

export const FormField = () => {
    const { code } = useParams();    
    const { createField, updateField, getField } = useField(code);
    
    const [area_web, setAreaWeb] = useState(0);
    
    const navigate = useNavigate();

    console.log('code', code);

    // Form
    const { register, handleSubmit, formState: { errors }, setValue, reset, watch } = useForm<FieldForm>();

    // Destructure mutations correctly
    const { mutate: createFieldMutation } = createField;
    const { mutate: updateFieldMutation } = updateField;

    const rented = String(watch('rented')); // Convert to boolean


    //!Update field lot
    const { data: fieldData, isLoading: isLoadingField } = getField;

    // Add this effect after the existing useEffect
    useEffect(() => {
         if (fieldData && code) {
            Object.entries(fieldData).forEach(([key, value]) => {
                setValue(key as keyof FieldForm, value as string | number);
            });
        }
    }, [fieldData, code, setValue]);



    //!Form submit
    const onSubmit = handleSubmit((data) => {
        if (code) {
            data.rented = rented === "true" ? true : false;
            console.log('data', data);
            updateFieldMutation({ 
                code, 
                data,
            }, {
                onSuccess: () => {
                    navigate('/field/list');
                    reset();
                }
            });
        } else {
            createFieldMutation(data, {
                onSuccess: () => {
                    navigate('/field/list');
                    reset();
                }
            });
        }
    });

    if (isLoadingField) {
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
                {code ? 'Actualizar lote de campo' : 'Crear lote de campo'}
            </h1>

            <form onSubmit={onSubmit} className="w-full">
                <div className="w-full grid grid-cols-2 gap-4">
                    {/* Basic Information Section */}
                    <div className="col-span-2">
                        <h2 className="text-xl font-semibold mb-4 text-zinc-800">Información Básica</h2>
                    </div>

                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del campo <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('name')}
                            name="name"
                            disabled={!!code}
                            placeholder="ABC123"
                            type="text"
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    {/* Rented Field */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Arrendado? <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('rented', {
                                required: 'Este campo es requerido',
                            })}
                            name="rented"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="true">Sí</option>
                            <option value="false">No</option>
                        </select>
                        {errors.rented && (
                            <p className="text-red-500 text-sm mt-1">{errors.rented.message}</p>
                        )}
                    </div>

                    {rented === "true" && (
                        <div className="col-span-2 grid grid-cols-2 gap-4">
                            <FormFieldUI
                                label="Periodo"
                                error={(errors.period && errors.period.message) || ""}
                            >
                                <select
                                    {...register("period")}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                                >
                                    <option value="">Seleccione un periodo</option>
                                    {RENT_PERIODS.map((period) => (
                                        <option key={period.months} value={period.months}>
                                            {period.name}
                                        </option>
                                    ))}
                                </select>
                            </FormFieldUI>

                            <FormFieldUI label="Costo de arriendo" error={errors.rent_cost?.message || ""}>
                                <input
                                    {...register("rent_cost")}
                                    name="rent_cost"
                                    placeholder="100"
                                    type="number"
                                    autoComplete="off"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                                />
                            </FormFieldUI>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <input
                            {...register('description')}
                            name="description"
                            placeholder="Descripción"
                            type="text"
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                   {/* Location */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ubicación
                        </label>
                        <input
                            {...register('location')}
                            name="location"
                            placeholder="San José"
                            type="text"
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.location && (
                            <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                        )}
                    </div>

                     {/* Area real Field */}
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area real <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('area_real', {
                                required: 'Este campo es requerido',
                            })}
                            name="area_real"
                            placeholder="100"
                            type="number"
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.area_real && (
                            <p className="text-red-500 text-sm mt-1">{errors.area_real.message}</p>
                        )}
                    </div>

                     {/* Area web Field */}
                     <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Area estimada <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('area_web')}
                            name="area_web"
                            disabled={true}
                            placeholder="100"
                            type="number"
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.area_web && (
                            <p className="text-red-500 text-sm mt-1">{errors.area_web.message}</p>
                        )}
                    </div>


                    <div className="col-span-2 mt-8">
                        <h2 className="text-xl font-semibold mb-4 text-zinc-800">Área del Lote</h2>
                        <MapPolygon 
                            initialCoordinates={fieldData?.coordinates?.[0] || [-34.656000, -56.592136]}
                            existingPolygon={fieldData?.coordinates}
                            onPolygonComplete={(polygon, hectares) => {
                                setValue('area_web', hectares);
                                setValue('coordinates', polygon);
                                setAreaWeb(hectares);
                            }}
                        />
                    </div>



                    {/* Buttons Section */}
                    <div className="col-span-2">
                        {
                            code && (<p className="text-red-500 text-sm mt-1">Si modifica el area, se le debe de dar la botón de "Save" que se encuentra en el mapa para que se guarde el area</p>)
                        }
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-8">
                            <button
                                type="button"
                                onClick={() => navigate('/field_lot/list')}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 focus:outline-none transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={!code && area_web === 0}
                                type="submit"
                                className={`w-full px-4 py-2 ${!code && area_web === 0 ? 'bg-gray-400' : 'bg-zinc-800 hover:bg-zinc-900'} text-white rounded-sm focus:outline-none transition-colors`}
                            >
                                {code ? 'Actualizar lote de campo' : 'Crear lote de campo'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}