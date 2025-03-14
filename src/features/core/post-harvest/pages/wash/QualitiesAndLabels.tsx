import { useForm } from "react-hook-form";
import { ActionButtons, FormField } from "../../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { CreateQualityForm } from "../../../../../interfaces";
import { useState } from "react";

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

  const onSubmit = handleSubmit((data) => {
    // Si no se incluye etiqueta, eliminar la propiedad label
    const dataToSubmit = includeLabel ? data : { name: data.name, description: data.description };
    
    console.log(JSON.stringify(dataToSubmit, null, 2)); 

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
      </form>
    </div>
  );
};
