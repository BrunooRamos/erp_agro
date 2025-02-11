import { CropEntity } from "../../../interfaces";

export const CropInfoCard = ({ crop }: { crop: CropEntity | undefined }) => {
    if (!crop) {
        return (
          <div className="col-span-2 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
            <p className="text-sm text-gray-500">
              Seleccione un cultivo para ver su información
            </p>
          </div>
        );
      }
    
      return (
        <div className="col-span-2 grid grid-cols-2 gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Cultivo</span>
            <span className="text-sm font-medium text-gray-900 mt-1">
              {crop.cultivo || '-'}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Campo</span>
            <span className="text-sm font-medium text-gray-900 mt-1">
              {crop.campo_name || '-'}
            </span>
          </div>
        </div>
      );
  };
  