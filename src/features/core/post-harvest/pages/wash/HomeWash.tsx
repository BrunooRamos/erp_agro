import { OptionCard } from "../../../../../ui/components";

export const HomeWash = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-plus"
        title="Proceso Wash"
        to="/post-harvest/wash/proceso-wash"
        description="Formulario para crear proceso wash"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-star"
        title="Calidades y Etiquetas"
        to="/post-harvest/wash/qualities"
        description="Formulario para crear calidades y etiquetas"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-money-bill"
        title="Costos de lavado"
        to="/post-harvest/wash/costs"
        description="Formulario para crear costos de lavado"
      />
    </div>
  );
};
