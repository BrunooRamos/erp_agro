import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';

import {  useField, useLot } from "../../../../hooks";
import { FieldEntity, LotForm } from "../../../../interfaces";
import { MapPolygon } from "../../../../ui/components";


export const FormLot = () => {
    const { code } = useParams();    
    const { createLot, updateLot, getLot } = useLot(code);
    
    const [area_web, setAreaWeb] = useState(0);
    
    const navigate = useNavigate();

    // Get fields
    const { getFields } = useField();
    const { data: fieldsData, isLoading: isLoadingField } = getFields;

    // Form
    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<LotForm>();

    // Destructure mutations correctly
    const { mutate: createLotMutation } = createLot;
    const { mutate: updateLotMutation } = updateLot;

    //!Update field lot
    const { data: lotData, isLoading: isLoadingLot } = getLot;

    // Add this effect after the existing useEffect
    useEffect(() => {
         if (lotData && code) {
            console.log('lotData', lotData);
            Object.entries(lotData.lot).forEach(([key, value]) => {
                setValue(key as keyof LotForm, value as string | number);
            });
        }
    }, [lotData, code, setValue]);


    //!Form submit
    const onSubmit = handleSubmit((data) => {
        if (code) {
            updateLotMutation({ 
                code, 
                data,
            }, {
                onSuccess: () => {
                    navigate('/lot/list');
                    reset();
                }
            });
        } else {
            createLotMutation(data, {
                onSuccess: () => {
                    navigate('/lot/list');
                    reset();
                }
            });
        }
    });

    if (isLoadingField || isLoadingLot) {
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

                    {/* Name Lot */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del lote <span className="text-red-500">*</span>
                        </label>
                        <input
                            {...register('name', {
                                required: 'Este campo es requerido',
                            })}
                            name="name"
                            placeholder="ABC123"
                            type="text"
                            autoComplete="off"
                            className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                     {/* Name Field */}
                     {
                        !code ? (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Campo <span className="text-red-500">*</span>
                                </label>
                                <select
                                    {...register('codigo_campo', {
                                        required: 'Este campo es requerido',
                                    })}
                                    name="codigo_campo"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                                    onChange={(e) => {
                                        register('codigo_campo').onChange(e);
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
                        ) : (
                            <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-sm">
                                <p className="text-gray-700 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    No se puede actualizar el campo una vez creado el lote.
                                </p>
                            </div>
                        )
                     }


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
                            placeholder="100.00"
                            type="number"
                            step="0.01"
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
                            initialCoordinates={lotData?.coordinates?.[0] || [-34.656000, -56.592136]}
                            existingPolygon={lotData?.coordinates}
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
                                onClick={() => navigate('/lot/list')}
                                className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-sm hover:bg-gray-300 focus:outline-none transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                disabled={!code && area_web === 0}
                                type="submit"
                                className={`w-full px-4 py-2 ${!code && area_web === 0 ? 'bg-gray-400' : 'bg-zinc-800 hover:bg-zinc-900'} text-white rounded-sm focus:outline-none transition-colors`}
                            >
                                {code ? 'Actualizar lote' : 'Crear lote'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}