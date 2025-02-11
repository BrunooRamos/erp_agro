import { OptionCard } from "../../../../ui/components/core/OptionCard"

export const HomeField = () => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            <OptionCard
                visible={true}
                icon="fa-solid fa-list"
                title="Listar campos"
                to="/field/list"
                description="Listado de campos"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-seedling"
                title="Crear campo"
                to="/field/create"
                description="Formulario para crear campo"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-map"
                title="Mapa de campo"
                to="/field/map"
                description="Mapa de campo"
            />
        </div>
    )
}