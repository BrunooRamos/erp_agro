import { OptionCard } from "../../../../ui/components";

export const SeedMapRegister = () => {
  return (
    <div className="flex flex-col gap-4">
      <OptionCard
        title="Crear Mapa de siembra"
        description="Crear Mapa de siembra"
        icon="fa-solid fa-plus"
        to="/registers/seed-map/create"
        visible={true}
      />
      <OptionCard
        title="Listar Mapa de siembra"
        description="Listar Mapa de siembra"
        icon="fa-solid fa-list"
        to="/registers/seed-map/list"
        visible={true}
      />
    </div>
  );
};
