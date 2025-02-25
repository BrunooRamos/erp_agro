import { useRegisters } from "../../../../../hooks";

export const ListSeedMap = () => {
    const { listSeedMap } = useRegisters();
    const { data: seedMapList, isLoading, error } = listSeedMap;
    
    if (isLoading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-800"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-red-500">
                Error al cargar los datos: {error.message}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-900">Registros de Siembra</h1>

            <div className="grid gap-4">
                {seedMapList?.map((register) => (
                    console.log(register),
                    <div 
                        key={register.seed_map.rowid}
                        className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center">
                                        <i className="fa-solid fa-seedling text-emerald-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-zinc-900">
                                        {new Date(register.seed_map.date).toLocaleDateString()}
                                        </h3>
                                        <p className="text-sm text-zinc-500">
                                            Total: {register.lots?.reduce((acc, lot) => acc + lot.area_utilizada, 0)?.toFixed(2) ?? 0} ha
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-sm rounded-full">
                                        {register.seed_map.crop_code}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Seeds and Chemicals */}
                        <div className="p-4">
                            <h4 className="text-sm font-medium text-zinc-500 mb-3">Semillas y Productos</h4>
                            <div className="space-y-3">
                                {register.products.map((product) => (
                                    <div 
                                        key={product.product_ref}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-zinc-800">{product.product_name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-zinc-800">
                                                {product.quantity} {product.unit}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lots */}
                        <div className="p-4 bg-gray-50 rounded-b-lg border-t border-gray-100">
                            <h4 className="text-sm font-medium text-zinc-500 mb-3">Lotes Afectados</h4>
                            <div className="flex flex-wrap gap-2">
                                {register.lots?.map((lot) => (
                                    <span 
                                        key={lot.rowid}
                                        className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-zinc-600"
                                    >
                                        {lot.name} ({lot.area_utilizada} ha)
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                {(!seedMapList || seedMapList.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <i className="fa-solid fa-seedling text-gray-300 text-4xl mb-3" />
                        <p className="text-gray-500">No hay registros de siembra</p>
                    </div>
                )}
            </div>
        </div>
    );
};