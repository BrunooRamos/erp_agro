import { OptionCard } from "../../../../ui/components";

export const HomeIrrigation = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-seedling"
        title="Crear riego"
        to="/irrigation/create"
        description="Formulario para crear riego"
      />
    </div>
  );
};
