import { OptionCard } from "../../../../ui/components/core/OptionCard";

export const PostHarvest = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-layer-group"
        title="Tong"
        to="/post-harvest/tong"
        description="Formulario para crear y listar procesos de tong"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-droplet"
        title="Lavado"
        to="/post-harvest/wash"
        description="Formulario para crear y listar procesos del lavadero"
      />
    </div>
  );
};
