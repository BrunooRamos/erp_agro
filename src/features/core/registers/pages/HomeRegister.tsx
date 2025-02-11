import { OptionCard } from "../../../../ui/components/core/OptionCard";

export const HomeRegister = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-list"
        title="Mapa de simbra"
        to="/registers/seed-map"
        description="Mapa de simbra"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-list"
        title="RAF"
        to="/registers/raf"
        description="RAF"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-list"
        title="Labores"
        to="/registers/general-labor"
        description="Labores"
      />
    </div>
  );
};
