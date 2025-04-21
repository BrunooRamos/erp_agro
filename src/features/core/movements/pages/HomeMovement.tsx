import { OptionCard } from "../../../../ui/components/core/OptionCard";

export const HomeMovement = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-file-invoice"
        title="Crear movimiento"
        to="/movements/create"
        description="Formulario para crear movimiento"
      />

      <OptionCard
        visible={true}
        icon="fa-solid fa-truck"
        title="Crear costo logístico"
        to="/movements/logistic-costs"
        description="Formulario para crear costo logístico"
      />

      <OptionCard
        visible={true}
        icon="fa-solid fa-file-invoice"
        title="Listar movimientos"
        to="/movements/list"
        description="Listar movimientos de papa desde el campo hasta los depositos"
      />
    </div>
  );
};
