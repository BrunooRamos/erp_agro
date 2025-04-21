import { OptionCard } from "../../../../../ui/components"


export const DepreciationCostHome = () => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            <OptionCard
                visible={true}
                icon="fa-solid fa-chart-line"
                title="Listar depreciación"
                to="/cost-center/depreciation/list"
                description="Listar depreciación"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-chart-line"
                title="Crear depreciación"
                to="/cost-center/depreciation/create"
                description="Crear depreciación"
            />
        </div>
    )
}