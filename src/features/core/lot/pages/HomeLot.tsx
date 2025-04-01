import { OptionCard } from "../../../../ui/components/core/OptionCard";

export const HomeLot = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-seedling"
        title="Crear lote"
        to="/lot/create"
        description="Formulario para crear lote"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-list"
        title="Listar lotes"
        to="/lot/list"
        description="Listado de lotes"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-map"
        title="Mapa de lotes"
        to="/lot/map"
        description="Mapa de lotes"
      />
    </div>
  );
};
