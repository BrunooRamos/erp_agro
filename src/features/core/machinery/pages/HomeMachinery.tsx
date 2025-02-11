import { OptionCard } from "../../../../ui/components/core/OptionCard"

export const HomeMachinery = () => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            <OptionCard
                visible={true}
                icon="fa-solid fa-tractor"
                title="Crear maquinaria"
                to="/machinery/create"
                description="Formulario para crear maquinaria"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-list"
                title="Listar maquinaria"
                to="/machinery/list"
                description="Listado de la maquinaria"
            />
        </div>
    )
}