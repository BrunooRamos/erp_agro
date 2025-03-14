import { FormField } from "../../../ui/components";
import { Caliber, TongProccesForm } from "../../../interfaces";
import { useEffect } from "react";
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";

interface CaliberOutputsProps {
  calibers: Caliber[];
  inputBins: number;
  register: UseFormRegister<TongProccesForm>;
  errors: FieldErrors<TongProccesForm>;
  watch: UseFormWatch<TongProccesForm>;
  setValue: UseFormSetValue<TongProccesForm>;
}

export const CaliberOutputs = ({
  calibers,
  inputBins,
  register,
  errors,
  watch,
  setValue,
}: CaliberOutputsProps) => {
  // Observar todos los valores de bins de calibre
  const caliberBins = calibers.map((_, index) => 
    watch(`caliber_outputs.${index}.bins`) || 0
  );

  // Calcular el total de bins de salida
  const totalOutputBins = caliberBins.reduce((sum, bins) => sum + Number(bins), 0);

  // Efecto para inicializar los valores de calibre
  useEffect(() => {
    calibers.forEach((caliber, index) => {
      setValue(`caliber_outputs.${index}.caliber_id`, caliber.id);
      setValue(`caliber_outputs.${index}.bins`, 0);
    });
  }, [calibers, setValue]);

  return (
    <div className="col-span-2 mt-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Encabezado con información */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Distribución de Calibres
          </h2>
          <p className="text-gray-600 text-sm">
            Indique la cantidad de bins que corresponde a cada calibre después del proceso Tong.
            La suma total debe coincidir con la cantidad de bins de entrada.
          </p>
        </div>



        {/* Grid de calibres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {calibers.map((caliber, index) => (
            <div 
              key={caliber.id}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <FormField
                label={caliber.name + " (" + caliber.description + ")"}
                error={errors?.caliber_outputs?.[index]?.bins?.message || ""}
              >
                <div className="flex gap-3 items-center mt-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      {...register(`caliber_outputs.${index}.bins`, {
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "El valor mínimo es 0"
                        },
                        validate: {
                          notGreaterThanInput: (value: number) => 
                            value <= inputBins || "No puede exceder el número de bins de entrada"
                        }
                      })}
                      placeholder="Cantidad"
                      disabled={!inputBins}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium whitespace-nowrap">bins</span>
                </div>
              </FormField>
            </div>
          ))}
        </div>

        {/* Resumen y validación */}
        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Resumen de distribución</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-3 py-2 bg-white rounded">
                <span className="text-sm text-gray-600">Bins de entrada</span>
                <span className="text-sm font-medium text-gray-800">{inputBins || 0}</span>
              </div>
              
              <div className="flex justify-between items-center px-3 py-2 bg-white rounded">
                <span className="text-sm text-gray-600">Bins distribuidos</span>
                <span className="text-sm font-medium text-gray-800">{totalOutputBins}</span>
              </div>

              {inputBins > 0 && inputBins !== totalOutputBins && (
                <div className="mt-3 p-3 bg-red-50 rounded-md border border-red-100">
                  <div className="flex items-center gap-2 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Distribución incompleta</p>
                      <p className="text-sm">
                        {totalOutputBins < inputBins 
                          ? `Faltan ${inputBins - totalOutputBins} bins por asignar`
                          : `Se han asignado ${totalOutputBins - inputBins} bins de más`}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {inputBins > 0 && inputBins === totalOutputBins && (
                <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                  <div className="flex items-center gap-2 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-medium">Distribución correcta</p>
                      <p className="text-sm">Todos los bins han sido asignados correctamente</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};