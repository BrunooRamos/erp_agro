import { LotEntity, SelectedLot } from "../../../interfaces";

const LotItem = ({ lot, isSelected, onSelect, onAreaChange }: { lot: LotEntity, isSelected: boolean, onSelect: (lotId: string, checked: boolean) => void, onAreaChange: (lotId: string, area: number) => void }) => (  
  <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm hover:border-gray-300 transition-all">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={(e) => onSelect(lot.rowid, e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
        aria-label={`Seleccionar lote ${lot.name}`}
      />
      <span className="flex-1 font-medium text-gray-700">{lot.name}</span>
      {isSelected && (
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="number"
              onChange={(e) => onAreaChange(lot.rowid, Number(e.target.value))}
              placeholder='0'
              className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
              min="0"
              max={lot.area_utilizada ? lot.area_utilizada : lot.area_real}
              step="0.01"
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md">
            <input
              type="checkbox"
              aria-label="Usar área máxima del lote"
              onChange={(e) => {
                if (e.target.checked) {
                  onAreaChange(lot.rowid, Number(lot.area_utilizada ? lot.area_utilizada : lot.area_real));
                }
              }}
              className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
            />
            <label className="text-sm text-gray-600 select-none">
              Usar máximo
            </label>
          </div>
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
            Máx: {lot.area_utilizada ? lot.area_utilizada : lot.area_real}
          </span>
        </div>
      )}
    </div>
  );



export const LotSelection = ({ lots, selectedLots, onSelect, onAreaChange }: { lots: LotEntity[] | undefined, selectedLots: SelectedLot[], onSelect: (lotId: string, checked: boolean) => void, onAreaChange: (lotId: string, area: number) => void }) => {
  
  
  if (!lots || lots.length === 0) {
      return (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-sm text-gray-500">
            Seleccione un cultivo para ver sus lotes disponibles
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-3">
        {lots.map(lot => {
          const isSelected = selectedLots.some(l => l.id_lote === lot.rowid);

          return (
            <LotItem 
              key={lot.rowid}
              lot={lot}
              isSelected={isSelected}
              onSelect={onSelect}
              onAreaChange={onAreaChange}
            />
          );
        })}
      </div>
    );
  };