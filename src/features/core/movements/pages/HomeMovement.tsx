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
    </div>
  );
};
