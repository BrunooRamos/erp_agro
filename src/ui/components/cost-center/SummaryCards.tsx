interface SummaryData {
  labors: number;
  rafs: number;
  seed_maps: number;
}

interface SummaryCardsProps {
  totals: SummaryData;
  grandTotal: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totals, grandTotal }) => {
  const cards = [
    {
      title: "Labores",
      value: totals.labors,
      icon: "fas fa-tractor",
      colors: {
        bg: "bg-blue-50",
        text: "text-blue-500",
      },
    },
    {
      title: "RAFs",
      value: totals.rafs,
      icon: "fas fa-spray-can",
      colors: {
        bg: "bg-green-50",
        text: "text-green-500",
      },
    },
    {
      title: "Siembras",
      value: totals.seed_maps,
      icon: "fas fa-seedling",
      colors: {
        bg: "bg-yellow-50",
        text: "text-yellow-500",
      },
    },
    {
      title: "Total General",
      value: grandTotal,
      icon: "fas fa-calculator",
      colors: {
        bg: "bg-purple-50",
        text: "text-purple-500",
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-lg ${card.colors.bg} flex items-center justify-center`}
            >
              <i className={`${card.icon} text-xl ${card.colors.text}`}></i>
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">{card.title}</p>
              <p className="text-2xl font-bold text-zinc-800">
                ${card.value.toLocaleString("es-PE", { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}; 