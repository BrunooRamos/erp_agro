import { OptionCard } from "../../../../ui/components/core/OptionCard";

export const LaborRegister = () => {
  return (
    <div className="flex flex-col gap-4">
      <OptionCard
        to="/registers/general-labor/create"
        icon="fa-solid fa-plus"
        title="Crear laboreo"
        description="Crear laboreo"
        visible={true}
      />

      <OptionCard
        to="/registers/general-labor/list"
        icon="fa-solid fa-list"
        title="Listar laboreos"
        description="Listar laboreos"
        visible={true}
      />
    </div>
  );
};
