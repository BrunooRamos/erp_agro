import { useState } from "react";
import { useCrop } from "../../../../hooks/crop/useCrop";
import { CropCard } from "../../../../ui/components/core/cost_center/CropCard";
import { useNavigate } from "react-router-dom";
import { CropEntity } from "../../../../interfaces";

export const ListOfCrops = () => {
  const navigate = useNavigate();
  const { listCrop } = useCrop();
  const { data = [], isLoading, error } = listCrop;
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar cultivos basado en el término de búsqueda
  const filteredCrops = data.filter(
    (crop) =>
      crop.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (crop.campo_name?.toLowerCase() || "").includes(
        searchTerm.toLowerCase()
      ) ||
      (crop.cultivo?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const handleCropClick = (crop: CropEntity) => {
    navigate(`/cost-center/details/${crop.code}`, {
      state: { crop },
    });
  };

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Cultivos</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Buscar por código, campo o cultivo..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-96 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-zinc-800"
        />
      </div>

      {/* Grid de Cultivos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCrops.map((crop) => (
          <div key={crop.code} onClick={() => handleCropClick(crop)}>
            <CropCard crop={crop} />
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay resultados */}
      {filteredCrops.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No se encontraron cultivos que coincidan con tu búsqueda
          </p>
        </div>
      )}
    </div>
  );
};
