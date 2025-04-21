import { OptionCard } from "../../../../ui/components"


export const HomeCostCenter = () => {
    return (
        <div className="flex flex-col gap-4 h-full justify-center">
            <OptionCard
                visible={true}
                icon="fa-solid fa-chart-line"
                title="Gastos"
                to="/cost-center/result-status"
                description="Gastos"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-arrow-down-wide-short"
                title="Depreciación"
                to="/cost-center/depreciation"
                description="Depreciación"
            />
            <OptionCard
                visible={true}
                icon="fa-solid fa-money-bill-trend-up"
                title="Otros gastos"
                to="/cost-center/other-expenses"
                description="Otros gastos"
            />
        </div>
    )
}