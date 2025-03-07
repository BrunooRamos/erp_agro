import { useForm } from "react-hook-form";
import { LogisticCostForm } from "../../../../interfaces";
import { ActionButtons, FormField } from "../../../../ui/components/";
import { useNavigate } from "react-router-dom";
import { useMovement } from "../../../../hooks/";


export const LogisticCosts = () => {

  const navigate = useNavigate();

  const { createLogisticCost } = useMovement();
  const { mutate: createLogisticCostMutation } = createLogisticCost;

  //!Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LogisticCostForm>();

  const onSubmit = handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2));
      createLogisticCostMutation(data, {
        onSuccess: () => {
          navigate("/movements");
        },
      });
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Crear costos logísticos</h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4 relative">
        <FormField
            label="Origen"
            error={errors.origin?.message || ""}
            required
          >
            <input
              {...register("origin", {
                required: "Este campo es requerido",
              })}
              name="origin"
              placeholder="Origen"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Destino"
            error={errors.destination?.message || ""}
          >
            <input
              {...register("destination")}
              name="destination"
              placeholder="Destino"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>


          <FormField label="Fecha" error={errors.date?.message || ""} required>
            <input
              {...register("date", {
                required: "Este campo es requerido",
              })}
              name="date"
              placeholder="DD/MM/YYYY"
              type="date"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Kilómetros"
            error={errors.kilometeres?.message || ""}
            required
          >
            <input
              {...register("kilometeres", {
                required: "Este campo es requerido",
              })}
              name="kilometeres"
              placeholder="Kilómetros"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Costo"
            error={errors.cost?.message || ""}
            required
          >
            <input
              {...register("cost", {
                required: "Este campo es requerido",
              })}
              name="cost"
              placeholder="Costo en UYU"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <ActionButtons
            onCancel={() => {
              reset();
              navigate("/movements");
            }}
            onSubmit={onSubmit}
          />
        </div>
      </form>
    </div>
  );
};
