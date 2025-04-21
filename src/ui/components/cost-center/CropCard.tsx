import { CropEntity } from "../../../interfaces";

interface CropCardProps {
    crop: CropEntity;
}

export const CropCard: React.FC<CropCardProps> = ({ crop }) => {
    return (
        <div className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/5 to-zinc-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Status indicator */}
            <div className="absolute top-4 right-4">
                <div className="w-2 h-2 rounded-full bg-zinc-400 shadow-lg shadow-zinc-400/50" />
            </div>

            {/* Content Container */}
            <div className="p-6">
                {/* Header Section */}
                <div className="mb-6">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-xs font-medium text-zinc-500 tracking-wider uppercase mb-1">
                                Código de Cultivo
                            </p>
                            <h3 className="text-xl font-bold text-zinc-900">
                                {crop.code}
                            </h3>
                        </div>
                        <span className="px-3 py-1 bg-zinc-100 text-zinc-600 text-xs font-medium rounded-full">
                            {crop.anio}
                        </span>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <i className="fa-solid fa-location-dot text-zinc-400" />
                        <p className="text-sm text-zinc-600">
                            {crop.campo_name || 'Sin ubicación'}
                        </p>
                    </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Cultivo
                        </p>
                        <p className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                            <i className="fa-solid fa-seedling text-zinc-400" />
                            {crop.cultivo || '-'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Periodo
                        </p>
                        <p className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                            <i className="fa-solid fa-calendar text-zinc-400" />
                            {crop.periodo || '-'}
                        </p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                            Etapa
                        </p>
                        <p className="text-sm font-semibold text-zinc-800 flex items-center gap-2">
                            <i className="fa-solid fa-clock text-zinc-400" />
                            {crop.etapa || '-'}
                        </p>
                    </div>
                </div>

                {/* Description Section */}
                {crop.description && (
                    <div className="pt-6 border-t border-gray-100">
                        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                            Descripción
                        </p>
                        <p className="text-sm text-zinc-600 line-clamp-2">
                            {crop.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 border-2 border-zinc-900/0 rounded-xl group-hover:border-zinc-900/10 transition-all duration-300" />
        </div>
    );
};