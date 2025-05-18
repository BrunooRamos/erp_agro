import { useForm } from "react-hook-form";
import { ActionButtons, FormField } from "../../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { CreateQualityForm } from "../../../../../interfaces";
import { useState } from "react";
import { usePostHarvest } from "../../../../../hooks/post-harvest/usePostHarvest";

export const QualitiesAndLabels = () => {
  const navigate = useNavigate();
  const [includeLabel, setIncludeLabel] = useState(false);

  //!Form 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CreateQualityForm>({
    defaultValues: {
      label: {
        name: "",
        descripcion: "",
      }
    }
  });

  const { createWashQuality, listWashQualities } = usePostHarvest();
  const { mutate: createWashQualityMutation } = createWashQuality;

  const { data: washQualities } = listWashQualities;

  const onSubmit = handleSubmit((data) => {
    // Si no se incluye etiqueta, eliminar la propiedad label
    const dataToSubmit = includeLabel ? data : { name: data.name, description: data.description };
    
    createWashQualityMutation(dataToSubmit as CreateQualityForm, {
      onSuccess: () => {
        listWashQualities.refetch();
      },
    });
  });

  // Manejar el cambio en el checkbox de incluir etiqueta
  const handleIncludeLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeLabel(e.target.checked);
    if (!e.target.checked) {
      // Limpiar los campos de la etiqueta si se desmarca
      setValue("label.name", "");
      setValue("label.descripcion", "");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear Calidad</h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <FormField label="Nombre" required error={errors.name?.message || ""}>
            <input
              {...register("name", {
                required: "Este campo es requerido",
              })}
              id="quality-name"
              aria-label="Nombre de la calidad"
              placeholder="Nombre de la calidad"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Descripción"
            error={errors.description?.message || ""}
          >
            <input
              {...register("description")}
              id="quality-description"
              aria-label="Descripción de la calidad"
              placeholder="Descripción de la calidad"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <div className="col-span-2">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="include-label"
                checked={includeLabel}
                onChange={handleIncludeLabelChange}
                className="h-4 w-4 text-zinc-800 focus:ring-zinc-700 border-gray-300 rounded"
              />
              <label htmlFor="include-label" className="ml-2 block text-sm text-gray-700">
                Incluir etiqueta
              </label>
            </div>
          </div>

          {includeLabel && (
            <>
              <FormField 
                label="Nombre de la Etiqueta" 
                required={includeLabel}
                error={errors.label?.name?.message || ""}
              >
                <input
                  {...register("label.name", {
                    required: includeLabel ? "Este campo es requerido" : false,
                  })}
                  id="label-name"
                  aria-label="Nombre de la etiqueta"
                  placeholder="Nombre de la etiqueta"
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>

              <FormField 
                label="Descripción de la Etiqueta" 
                error={errors.label?.descripcion?.message || ""}
              >
                <input
                  {...register("label.descripcion")}
                  id="label-description"
                  aria-label="Descripción de la etiqueta"
                  placeholder="Descripción de la etiqueta"
                  autoComplete="off"
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
                />
              </FormField>
            </>
          )}

          <ActionButtons
            onCancel={() => {
              reset();
              setIncludeLabel(false);
              navigate("/post-harvest");
            }}
            onSubmit={onSubmit}
          />
        </div>

        {/* Listar calidades */}
        <div className="w-full mt-8">
          <h2 className="text-xl font-semibold mb-6 text-zinc-800">Calidades</h2>
          <div className="grid gap-4">
            {washQualities?.map((quality) => (
              <div
                key={quality.rowid}
                className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-zinc-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                      <i className="fas fa-star text-zinc-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-zinc-800">{quality.quality.name}</h3>
                      <p className="text-sm text-zinc-500">
                        {quality.quality.descripcion || 'Sin descripción'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {quality.label.name !== "" && (
                      <div className="flex flex-col items-end">
                        <span className="text-xs font-medium bg-zinc-100 px-2 py-1 rounded-full">
                          Etiqueta: {quality.label.name}
                        </span>
                        {quality.label.descripcion && (
                          <span className="text-xs text-gray-500 mt-1">
                            {quality.label.descripcion}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {(!washQualities || washQualities.length === 0) && (
              <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <i className="fas fa-star text-gray-400 text-2xl mb-2" />
                <p className="text-gray-500">No hay calidades registradas</p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};
