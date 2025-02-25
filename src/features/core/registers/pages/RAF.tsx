import { OptionCard } from "../../../../ui/components";

export const RAF = () => {
  return (
    <div className="flex flex-col gap-4">
      <OptionCard
        to="/registers/raf/create"
        icon="fa-solid fa-plus"
        title="Crear RAF"
        description="Crear RAF"
        visible={true}
      />

      <OptionCard
        to="/registers/raf/list"
        icon="fa-solid fa-list"
        title="Listar RAF"
        description="Listar RAF"
        visible={true}
      />
    </div>
  );
};
