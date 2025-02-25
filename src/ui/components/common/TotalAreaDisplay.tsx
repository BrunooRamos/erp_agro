import { SelectedLot, SelectedSubLot } from "../../../interfaces";

export const TotalAreaDisplay = ({ selectedLots, selectedSublots }: { selectedLots: SelectedLot[], selectedSublots?: SelectedSubLot[] }) => {
  const areaSublots = selectedSublots ? selectedSublots.reduce((acc, sublot) => acc + (sublot.area_utilizada || 0), 0) : 0;
  const areaLots = selectedLots.reduce((acc, lot) => acc + (lot.area_utilizada || 0), 0);
  
  const total = areaSublots + areaLots;

  return (
      <div className="col-span-2 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">Área total:</span>
          <span className="text-lg font-semibold text-zinc-800">
            {total.toFixed(2)} ha
          </span>
        </div>
      </div>
    );
  };
  