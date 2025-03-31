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
  // Observar todos los valores de bolsas de calidad
  const qualityBags = qualities.map((_, index) => 
    watch(`quality_outputs.${index}.bags`) || 0
  );

  // Efecto para inicializar los valores de calidad
  useEffect(() => {
    qualities.forEach((quality, index) => {
      setValue(`quality_outputs.${index}.quality_id`, Number(quality.rowid));
      setValue(`quality_outputs.${index}.bags`, 0);
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
                error={errors?.quality_outputs?.[index]?.bags?.message || ""}
              >
                <div className="flex gap-3 items-center mt-2">
                  <div className="flex-1">
                    <input
                      type="number"
                      min={0}
                      {...register(`quality_outputs.${index}.bags`, {
                        valueAsNumber: true,
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
                <span className="text-sm font-medium text-gray-800">{qualityBags.reduce((sum, bags) => sum + Number(bags), 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
