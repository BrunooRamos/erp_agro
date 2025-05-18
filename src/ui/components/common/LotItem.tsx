import { LotEntity, SelectedLot, SelectedSubLot } from "../../../interfaces";

const LotItem = ({
  lot,
  isLotSelected,
  onLotSelect,
  onAreaChange,
  selectedLots,

  //Sublot
  isSublotSelected,
  onSublotSelect,
  selectedSublots,
  onSublotAreaChange,
  
  // Funciones para obtener el área máxima
  getMaxAreaForLot,
  getMaxAreaForSublot
}: {
  lot: LotEntity;
  isLotSelected: boolean;
  onLotSelect: (lotId: string, checked: boolean) => void;
  onAreaChange: (lotId: string, area: number) => void;
  selectedLots: SelectedLot[];
  
  //Sublot
  isSublotSelected: (sublotId: string) => boolean;
  onSublotSelect: (sublotId: string, checked: boolean) => void;
  selectedSublots: SelectedSubLot[];
  onSublotAreaChange: (sublotId: string, area: number) => void;
  
  // Funciones para obtener el área máxima
  getMaxAreaForLot?: (lotId: string) => number;
  getMaxAreaForSublot?: (sublotId: string) => number;
}) => {
  // Calcular el área máxima para el lote actual
  const maxLotArea = getMaxAreaForLot ? getMaxAreaForLot(lot.rowid) : 
    Number(lot.area_utilizada ? lot.area_utilizada : lot.area_real);
    
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-md bg-white shadow-sm hover:border-gray-300 transition-all">
        <input
          type="checkbox"
          checked={isLotSelected}
          onChange={(e) => onLotSelect(lot.rowid, e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
          aria-label={`Select lot ${lot.name}`}
        />
        <span className="flex-1 font-medium text-gray-700">{lot.name}</span>
        {isLotSelected && lot.sublots.length === 0 && (
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="number"
                value={selectedLots.find((l) => l.id_lote === lot.rowid)?.area_utilizada || ''}
                onChange={(e) =>
                  onAreaChange(lot.rowid, Number(e.target.value))
                }
                placeholder="0"
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
                min="0"
                max={maxLotArea}
                step="0.01"
              />
            </div>

            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-md">
              Max: {maxLotArea}
            </span>
          </div>
        )}
      </div>

      {/* Sublots section */}
      {lot.sublots && lot.sublots.length > 0 && isLotSelected && (
        <div className="ml-8 space-y-2">
          {lot.sublots.map((sublot) => {
            // Calcular el área máxima para el sublote actual
            const maxSublotArea = getMaxAreaForSublot ? getMaxAreaForSublot(sublot.rowid) : 
              Number(sublot.area_utilizada);
              
            return (
              <div
                key={sublot.rowid}
                className="flex items-center gap-4 p-3 border border-gray-100 rounded-md bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={isSublotSelected(sublot.rowid)}
                  onChange={(e) => onSublotSelect(sublot.rowid, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-zinc-800 focus:ring-zinc-800"
                  aria-label={`Select sublot ${sublot.name}`}
                />
                <span className="flex-1 text-sm text-gray-600">
                  {sublot.name}
                </span>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="number"
                        value={selectedSublots.find((s) => s.id_sub_lote === sublot.rowid)?.area_utilizada || ''}
                        onChange={(e) =>
                          onSublotAreaChange(sublot.rowid, Number(e.target.value))
                        }
                        placeholder="0"
                        className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-zinc-800 focus:border-zinc-800"
                        min="0"
                        max={maxSublotArea}
                        step="0.01"
                        disabled={!isSublotSelected(sublot.rowid)}
                      />
                    </div>
                    <span className="text-sm text-gray-500 bg-white px-3 py-1 rounded-md">
                      Max: {maxSublotArea}
                    </span>
                  </div>
              </div>
            );
          })}
        </div>
      )}    
    </div>
  );
};

export const LotSelection = ({
  lots,
  selectedLots,
  onLotSelect,
  onAreaChange,
  onSublotSelect,
  selectedSublots,
  onSublotAreaChange,
  getMaxAreaForLot,
  getMaxAreaForSublot
}: {
  lots: LotEntity[] | undefined;
  selectedLots: SelectedLot[];
  onLotSelect: (lotId: string, checked: boolean) => void;
  onAreaChange: (lotId: string, area: number) => void;
  onSublotSelect: (sublotId: string, checked: boolean) => void;
  selectedSublots: SelectedSubLot[];
  onSublotAreaChange: (sublotId: string, area: number) => void;
  getMaxAreaForLot?: (lotId: string) => number;
  getMaxAreaForSublot?: (sublotId: string) => number;
}) => {
  if (!lots || lots.length === 0) {
    return (
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
        <p className="text-sm text-gray-500">
          Select a crop to see its available lots
        </p>
      </div>
    );
  }

  // Organizar los sublotes por lote padre
  const lotsWithSublots = lots.map(lot => ({
    ...lot,
    sublots: lot.sublots.filter(sublot => sublot.lot_id === lot.rowid)
  }));

  return (
    <div className="space-y-3">
      {lotsWithSublots.map((lot) => {
        const isLotSelected = selectedLots.some((l) => l.id_lote === lot.rowid);

        return (
          <LotItem
            key={lot.rowid}
            lot={lot}
            isLotSelected={isLotSelected}
            onLotSelect={onLotSelect}
            onAreaChange={onAreaChange}
            selectedLots={selectedLots}
            isSublotSelected={(sublotId: string) => 
              selectedSublots.some(s => s.id_sub_lote === sublotId)
            }
            onSublotSelect={onSublotSelect}
            selectedSublots={selectedSublots}
            onSublotAreaChange={onSublotAreaChange}
            getMaxAreaForLot={getMaxAreaForLot}
            getMaxAreaForSublot={getMaxAreaForSublot}
          />
        );
      })}
    </div>
  );
};
