import { OptionCard } from "../../../../ui/components/core/OptionCard"

export const HomeCrop = () => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            <OptionCard
                visible={true}
                icon="fa-solid fa-list"
                title="Listar cultivos"
                to="/crop/list"
                description="Listado de cultivos"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-seedling"
                title="Crear cultivo"
                to="/crop/create"
                description="Formulario para crear cultivo"
            />
        </div>
    )
}