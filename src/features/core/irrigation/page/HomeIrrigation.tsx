import { OptionCard } from "../../../../ui/components";

export const HomeIrrigation = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-water"
        title="Crear riego"
        to="/irrigation/create"
        description="Formulario para crear riego"
      />

      <OptionCard
        visible={true}
        icon="fa-solid fa-list"
        title="Listado de riegos"
        to="/irrigation/list"
        description="Ver listado de riegos"
      />

      <OptionCard
        visible={true}
        icon="fa-solid fa-money-bill"
        title="Costos de riegos"
        to="/irrigation/costs"
        description="Ver costos de riegos"
      />
    </div>
  );
};
