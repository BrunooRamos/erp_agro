import { useForm } from "react-hook-form";
import { MachineryForm } from "../../../../interfaces";
import { useCusa } from "../../../../hooks/others/useCusa";
import { useEffect } from "react";
import { useMachinery } from "../../../../hooks";
import { useNavigate, useParams } from "react-router-dom";

export const FormMachinery = () => {
  // Get machinery code from URL if editing
  const { code } = useParams();
  const isEditing = Boolean(code);

  // Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<MachineryForm>();

  // Get machinery data when editing
  const { machineryById, createMachinery, updateMachinery } =
    useMachinery(code);
  const { data: machineryData, isLoading: isLoadingMachinery } = machineryById;

  // Peticiones, una para obtener los datos de la cusa y otra para crear la maquinaria
  const { data: cusa, isLoading: isLoadingCusa } = useCusa();

  const { mutate: createMachineryMutation } = createMachinery;
  const { mutate: updateMachineryMutation } = updateMachinery;

  // Redireccionar cuando se crea la maquinaria
  const navigate = useNavigate();

  // Add this effect after the existing useEffect
  useEffect(() => {
    if (machineryData && isEditing) {
      Object.entries(machineryData).forEach(([key, value]) => {
        setValue(key as keyof MachineryForm, value as string | number);
      });
    }
  }, [machineryData, isEditing, setValue]);

  // Submit del formulario
  const onSubmit = handleSubmit((data) => {
    if (isEditing && code) {
      console.log(data, "data");
      console.log(code, "code");
      updateMachineryMutation(
        {
          code,
          data,
        },
        {
          onSuccess: () => {
            navigate("/machinery/list");
            reset();
          },
        }
      );
    } else {
      console.log(data);
      createMachineryMutation(data, {
        onSuccess: () => {
          navigate("/machinery/list");
          reset();
        },
      });
    }
  });

  // Carga de la cusa
  if (isLoadingCusa || isLoadingMachinery) {
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
        {isEditing ? "Actualizar maquinaria" : "Crear maquinaria"}
      </h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4">
          {/* Basic Information Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 text-zinc-800">
              Información Básica
            </h2>
          </div>

          {/* Code Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código <span className="text-red-500">*</span>
            </label>
            <input
              {...register("code", {
                required: "Este campo es requerido",
              })}
              name="code"
              placeholder="ABC123"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
              disabled={isEditing}
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              {...register("name", {
                required: "Este campo es requerido",
              })}
              name="name"
              placeholder="Tractor..."
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Brand Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Marca <span className="text-red-500">*</span>
            </label>
            <input
              {...register("brand", {
                required: "Este campo es requerido",
              })}
              name="brand"
              placeholder="Jhon Deere"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.brand && (
              <p className="text-red-500 text-sm mt-1">
                {errors.brand.message}
              </p>
            )}
          </div>

          {/* Model */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo <span className="text-red-500">*</span>
            </label>
            <input
              {...register("model", {
                required: "Este campo es requerido",
              })}
              name="model"
              placeholder="9600"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.model && (
              <p className="text-red-500 text-sm mt-1">
                {errors.model.message}
              </p>
            )}
          </div>

          {/* Fabrication Year */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año de fabricación
            </label>
            <input
              {...register("year_fabrication")}
              name="year_fabrication"
              placeholder="2025"
              type="number"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.year_fabrication && (
              <p className="text-red-500 text-sm mt-1">
                {errors.year_fabrication.message}
              </p>
            )}
          </div>

          {/* State */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              {...register("state")}
              name="state"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccionar estado</option>
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
              <option value="en reparacion">Alquilado</option>
            </select>
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          {/* Purchase Year */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Año de compra
            </label>
            <input
              {...register("year_purchase")}
              name="year_purchase"
              placeholder="2025"
              type="number"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.year_purchase && (
              <p className="text-red-500 text-sm mt-1">
                {errors.year_purchase.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción u observaciones
            </label>
            <textarea
              {...register("description")}
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Technical Details Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 mt-6 text-zinc-800">
              Detalles Técnicos
            </h2>
          </div>

          {/* Labor Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Labor <span className="text-red-500">*</span>
            </label>
            <select
              {...register("cusa_id", {
                required: "Este campo es requerido",
              })}
              name="cusa_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              <option value="">Seleccionar labor</option>
              {cusa?.map((labor) => (
                <option key={labor.cod_laboreo} value={labor.rowid}>
                  {labor.laboreo} - {labor.precio_cusa}
                </option>
              ))}
            </select>
            {errors.cusa_id && (
              <p className="text-red-500 text-sm mt-1">
                {errors.cusa_id.message}
              </p>
            )}
          </div>

          {/* Maintenance Hours */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Horas de mantenimiento
            </label>
            <input
              {...register("maintenance_hours")}
              name="maintenance_hours"
              placeholder="100"
              type="number"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.maintenance_hours && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maintenance_hours.message}
              </p>
            )}
          </div>

          {/* Documentation Section */}
          <div className="col-span-2">
            <h2 className="text-xl font-semibold mb-4 mt-6 text-zinc-800">
              Documentación
            </h2>
          </div>

          {/* Plate Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Matricula
            </label>
            <input
              {...register("plate")}
              name="plate"
              placeholder="ABC123"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.plate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.plate.message}
              </p>
            )}
          </div>

          {/* Padron */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Padrón
            </label>
            <input
              {...register("padron")}
              name="padron"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.padron && (
              <p className="text-red-500 text-sm mt-1">
                {errors.padron.message}
              </p>
            )}
          </div>

          {/* ID Padron */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Padrón
            </label>
            <input
              {...register("id_padron")}
              name="id_padron"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.id_padron && (
              <p className="text-red-500 text-sm mt-1">
                {errors.id_padron.message}
              </p>
            )}
          </div>

          {/* Insurance */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seguro
            </label>
            <input
              {...register("insurance")}
              name="insurance"
              type="text"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
            {errors.insurance && (
              <p className="text-red-500 text-sm mt-1">
                {errors.insurance.message}
              </p>
            )}
          </div>

          {/* Buttons Section */}
          <div className="col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 mt-8">
              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-zinc-800 text-white rounded-sm hover:bg-zinc-900 focus:outline-none transition-colors"
                >
                  {isEditing ? "Actualizar maquinaria" : "Crear maquinaria"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
