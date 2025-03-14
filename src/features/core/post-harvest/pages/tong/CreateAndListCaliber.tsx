import { useForm } from "react-hook-form";
import { ActionButtons, FormField } from "../../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { CreateCaliberForm } from "../../../../../interfaces";
import { usePostHarvest } from "../../../../../hooks/post-harvest/usePostHarvest";

export const CreateAndListCaliber = () => {
  const navigate = useNavigate();

  //!Form 
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateCaliberForm>();


  const { createCaliber } = usePostHarvest();
  const { mutate: createCaliberMutation } = createCaliber;

  const onSubmit = handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2)); 
    createCaliberMutation(data, {
        onSuccess: () => {
          listCalibers.refetch();
        },
    });
  });

  //!Listar calibres
  const { listCalibers } = usePostHarvest();
  const { data: calibers } = listCalibers;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear calibre</h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <FormField label="Nombre" required error={errors.name?.message || ""}>
            <input
              {...register("name", {
                required: "Este campo es requerido",
              })}
              name="name"
              placeholder="Nombre"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Descripción"
            required
            error={errors.description?.message || ""}
          >
            <input
              {...register("description", {
                required: "Este campo es requerido",
              })}
              name="description"
              placeholder="Descripción"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <ActionButtons
            onCancel={() => {
              reset();
              navigate("/post-harvest");
            }}
            onSubmit={onSubmit}
          />
        </div>
          {/* Listar calibres */}
          <div className="w-full">
            <h2 className="text-xl font-semibold mb-6 text-zinc-800">Calibres</h2>
            <div className="grid gap-4">
              {calibers?.map((caliber) => (
                <div
                  key={caliber.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:border-zinc-300 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center">
                        <i className="fas fa-ruler text-zinc-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-zinc-800">{caliber.name}</h3>
                        <p className="text-sm text-zinc-500">
                          {caliber.description || 'Sin descripción'}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-medium text-zinc-600 bg-zinc-100 px-2 py-1 rounded-full">
                      ID: {caliber.id}
                    </span>
                  </div>
                </div>
              ))}
              
              {(!calibers || calibers.length === 0) && (
                <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                  <i className="fas fa-ruler-combined text-gray-400 text-2xl mb-2" />
                  <p className="text-gray-500">No hay calibres registrados</p>
                </div>
              )}
            </div>
          </div>
          

      </form>
    </div>
  );
};
