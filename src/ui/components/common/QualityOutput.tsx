import { FormField } from "../../../ui/components";
import { WashQualityResponse, WashProcessForm } from "../../../interfaces";
import { useEffect } from "react";
import { UseFormRegister, UseFormWatch, UseFormSetValue, FieldErrors } from "react-hook-form";

interface QualityOutputsProps {
  qualities: WashQualityResponse[];
  inputBins: number;
  register: UseFormRegister<WashProcessForm>;
  errors: FieldErrors<WashProcessForm>;
  watch: UseFormWatch<WashProcessForm>;
  setValue: UseFormSetValue<WashProcessForm>;
}

export const QualityOutputs = ({
  qualities,
  inputBins,
  register,
  errors,
  watch,
  setValue,
}: QualityOutputsProps) => {
  // Observar todos los valores de bins de calidad
  const qualityBins = qualities.map((_, index) => 
    watch(`quality_outputs.${index}.bins`) || 0
  );

  // Calcular el total de bins de salida
  const totalOutputBins = qualityBins.reduce((sum, bins) => sum + Number(bins), 0);

  // Efecto para inicializar los valores de calidad
  useEffect(() => {
    qualities.forEach((quality, index) => {
      setValue(`quality_outputs.${index}.quality_id`, Number(quality.rowid));
      setValue(`quality_outputs.${index}.bins`, 0);
    });
  }, [qualities, setValue]);

  return (
    <div className="col-span-2 mt-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        {/* Encabezado con información */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Distribución de Calidades
          </h2>
          <p className="text-gray-600 text-sm">
            Indique la cantidad de bolsas que corresponde a cada calidad después del proceso de lavado.
          </p>
        </div>

        {/* Grid de calidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {qualities.map((quality, index) => (
            <div 
              key={quality.rowid}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              <FormField
                label={`${quality.quality.name} - ${quality.label.name ? quality.label.name : "No tiene etiqueta"}`}
                error={errors?.quality_outputs?.[index]?.bins?.message || ""}
              >
                <div className="flex gap-3 items-center mt-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      min={0}
                      {...register(`quality_outputs.${index}.bins`, {
                        valueAsNumber: true,
                        validate: {
                          minValue: (value) => 
                            value >= 0 || "La cantidad no puede ser negativa",
                          totalBags: (value) => 
                            value >= inputBins || `La cantidad de bolsas debe ser mayor o igual a ${inputBins} bins`,
                        }
                      })}
                      placeholder="Cantidad"
                      disabled={!inputBins}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <span className="text-sm text-gray-600 font-medium whitespace-nowrap">bolsas</span>
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
                <span className="text-sm text-gray-600">Bolsas distribuidas</span>
                <span className="text-sm font-medium text-gray-800">{totalOutputBins}</span>
              </div>

              {inputBins > 0 && totalOutputBins >= inputBins && (
                <div className="mt-3 p-3 bg-green-50 rounded-md border border-green-100">
                  <div className="flex items-center gap-2 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm">Distribución correcta</p>
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
