import { OptionCard } from "../../../../../ui/components";

export const HomeTong = () => {
  return (
    <div className="flex flex-col gap-4 h-full justify-center">
      <OptionCard
        visible={true}
        icon="fa-solid fa-layer-group"
        title="Proceso Tong"
        to="/post-harvest/tong/proceso-tong"
        description="Formulario para crear movimiento"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-list"
        title="Listar Procesos de Tong"
        to="/post-harvest/tong/list-tong-processes"
        description="Listar procesos de tong"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-layer-group"
        title="Calibres"
        to="/post-harvest/tong/create-caliber"
        description="Formulario para crear y listar calibres"
      />
      <OptionCard
        visible={true}
        icon="fa-solid fa-money-bill"
        title="Costo Tong"
        to="/post-harvest/tong/costo-tong"
        description="Formulario para crear costos"
      />
    </div>
  );
};
