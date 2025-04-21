import { OptionCard } from "../../../../../ui/components"


export const OtherExpensesHome = () => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            <OptionCard
                visible={true}
                icon="fa-solid fa-chart-line"
                title="Listar otros gastos"
                to="/cost-center/other-expenses/list"
                description="Listar otros gastos"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-chart-line"
                title="Crear otros gastos"
                to="/cost-center/other-expenses/create"
                description="Crear otros gastos"
            />
        </div>
    )
}