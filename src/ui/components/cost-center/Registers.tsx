import dayjs from "dayjs";

interface Lot {
  id: number;
  name: string;
  area: number;
  sublot?: {
    name: string;
  };
}

interface Product {
  product_name: string;
  quantity: number;
  unit?: string;
  total_price: number;
}

interface RegisterProps {
  type: "labor" | "raf" | "seed_map";
  data: any[];
  title: string;
  icon: string;
  colorScheme: {
    headerBg: string;
    headerBorder: string;
    headerText: string;
  };
}

export const Registers: React.FC<RegisterProps> = ({
  type,
  data,
  title,
  icon,
  colorScheme,
}) => {
  const renderCostDetails = (item: any) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div className="bg-blue-50 rounded-lg p-3">
        <p className="text-xs text-blue-600 uppercase">Costo CUSA</p>
        <p className="text-sm font-medium">${item.cusa_cost}</p>
      </div>
      <div className="bg-green-50 rounded-lg p-3">
        <p className="text-xs text-green-600 uppercase">Costo Labor</p>
        <p className="text-sm font-medium">${item.labor_cost}</p>
      </div>
      <div className="bg-yellow-50 rounded-lg p-3">
        <p className="text-xs text-yellow-600 uppercase">Combustible</p>
        <p className="text-sm font-medium">
          {item.fuel_liters}L @ ${item.fuel_price}/L
        </p>
        <p className="text-sm font-medium">
          Total: ${item.fuel_cost || item.fuel_cost_usd}
        </p>
      </div>
    </div>
  );

  const renderProducts = (products: Product[]) => {
    if (!products?.length) return null;
    
    return (
      <div className="mt-4">
        <h4 className="text-sm font-medium text-zinc-700 mb-2">
          Productos Utilizados
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm font-medium text-zinc-700">
                {product.product_name}
              </p>
              <p className="text-xs text-zinc-500">
                Cantidad: {product.quantity} {product.unit || "unidades"}
              </p>
              <p className="text-xs text-zinc-500">
                Total: ${product.total_price}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderLots = (lots: Lot[]) => (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-zinc-700 mb-2">
        Lotes Afectados
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {lots.map((lot) => (
          <div key={lot.id} className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm font-medium text-zinc-700">{lot.name}</p>
            <p className="text-xs text-zinc-500">Área: {lot.area} ha</p>
            {lot.sublot && (
              <p className="text-xs text-zinc-500">
                Sublote: {lot.sublot.name}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  if (!data?.length) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`px-6 py-4 ${colorScheme.headerBg} ${colorScheme.headerBorder}`}>
        <h2 className={`text-lg font-semibold ${colorScheme.headerText}`}>
          <i className={`${icon} mr-2`}></i>
          {title}
        </h2>
      </div>
      <div className="divide-y divide-gray-100">
        {data.map((item) => (
          <div key={item.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-zinc-800">
                  {type === "labor" && item.labor_name}
                  {type === "raf" && item.type}
                  {type === "seed_map" && `Siembra - ${item.crop_code}`}
                </h3>
                <p className="text-sm text-zinc-500">
                  <i className="far fa-calendar mr-2"></i>
                  {dayjs(item.date).format("DD/MM/YYYY")}
                </p>
                {type === "labor" && (
                  <p className="text-sm text-zinc-500">
                    <i className="fas fa-hashtag mr-2"></i>
                    Código: {item.labor_code}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-zinc-800">
                  ${item.total_cost.toLocaleString("es-PE", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <p className="text-sm text-zinc-500">
                  Área: {item.total_area} ha
                </p>
              </div>
            </div>

            {renderCostDetails(item)}
            {item.products && renderProducts(item.products)}
            {item.lots && renderLots(item.lots)}
          </div>
        ))}
      </div>
    </div>
  );
};
