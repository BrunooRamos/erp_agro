import { OptionCard } from "../../../../ui/components/core/OptionCard";

export const PostHarvest = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-layer-group"
        title="Tong Procces"
        to="/post-harvest/tong"
        description="Formulario para crear movimiento"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-layer-group"
        title="Calibres"
        to="/post-harvest/create-caliber"
        description="Formulario para crear y listar calibres"
      />
    </div>
  );
};
