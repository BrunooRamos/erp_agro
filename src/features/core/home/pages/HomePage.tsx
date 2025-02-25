
import { OptionCard } from "../../../../ui/components/core/OptionCard"

export const HomePage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Bienvenido a Vicentina - Agro</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-tractor"
                    title="Maquinaria"
                    to="/machinery"
                    description="Gestión de maquinaria agrícola"
                />
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-wheat-awn"
                    title="Campo"
                    to="/field"
                    description="Gestión de campos"
                />
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-mountain-sun"
                    title="Lote"
                    to="/lot"
                    description="Gestión de lotes"
                />
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-seedling"
                    title="Cultivos"
                    to="/crop"
                    description="Gestión de cultivos"
                />
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-sheet-plastic"
                    title="Registros"
                    to="/registers"
                    description="Gestión de registros"
                />
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-water"
                    title="Riegos"
                    to="/irrigation"
                    description="Gestión de riegos"
                />
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-file-invoice"
                    title="Movimientos"
                    to="/movements"
                    description="Gestión de movimientos"
                />
                <OptionCard
                    visible={true}
                    icon="fa-solid fa-money-bill"
                    title="Centro de Costo"
                    to="/cost-center/list"
                    description="Gestión de centro de costo"
                />
            </div>
        </div>
    )
}