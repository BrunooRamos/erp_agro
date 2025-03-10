import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ActionButtons, FormField } from "../../../../ui/components";
import { TongProccesForm } from "../../../../interfaces";
import { useGetProductsByCategory } from "../../../../hooks";

export const TongProcces = () => {
  const navigate = useNavigate();

  const { data: products } = useGetProductsByCategory(true, "Papa");
  

  //!Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TongProccesForm>();

  const onSubmit = handleSubmit((data) => {
    console.log(JSON.stringify(data, null, 2));
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Proceso Tong</h1>

      <form onSubmit={onSubmit} className="w-full">
        <div className="w-full grid grid-cols-2 gap-4 relative">
          <FormField
            label="Fecha"
            required
            error={errors.date?.message || ""}
          >
            <input
              {...register("date", {
                required: "Este campo es requerido",
              })}
              name="date"
              placeholder="Fecha"
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            />
          </FormField>

          <FormField
            label="Producto"
            required
            error={errors.product_id?.message || ""}
          >
            <select
              {...register("product_id", {
                required: "Este campo es requerido",
              })}
              name="product_id"
              className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-zinc-800"
            >
              {products?.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.label}
                </option>
              ))}
            </select>
          </FormField>

          <FormField
            label="Número de bines"
            required
            error={errors.number_of_bins?.message || ""}
          >
            <input  
              {...register("number_of_bins", {
                required: "Este campo es requerido",
              })}
              name="number_of_bins"
              placeholder="Número de bines"
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
      </form>
    </div>
  );
};
