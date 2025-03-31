import { OptionCard } from "../../../../ui/components"


export const HomeCostCenter = () => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            <OptionCard
                visible={true}
                icon="fa-solid fa-list"
                title="Listar cultivos"
                to="/cost-center/list"
                description="Listado de cultivos"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-chart-line"
                title="Resultados"
                to="/cost-center/result-status"
                description="Resultados"
            />
        </div>
    )
}