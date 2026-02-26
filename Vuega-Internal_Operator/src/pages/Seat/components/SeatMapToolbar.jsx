function StatPill({ label, value }) {
  return (
    <div className="px-3 py-1.5 rounded-lg bg-[#FFFBEA] border border-yellow-200 text-gray-700 font-semibold text-sm">
      {label}: {value}
    </div>
  );
}

export default function SeatMapToolbar({
  totalSeats,
  selectedLayout,
  activeDeckId,
  setActiveDeckId,
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-5">
      <StatPill label="Total seats" value={totalSeats} />
      {selectedLayout.showDeckTabs && (
        <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
          {selectedLayout.decks.map((deck) => (
            <button
              key={deck.id}
              onClick={() => setActiveDeckId(deck.id)}
              className={`px-4 py-1.5 text-sm font-medium transition-colors ${
                activeDeckId === deck.id
                  ? 'bg-[#A5E1FF] text-gray-900'
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {deck.id === 'lower' ? 'Lower Deck' : 'Upper Deck'}
            </button>
          ))}
        </div>
      )}
      <span className="text-sm text-gray-500">Type: {selectedLayout.label}</span>
    </div>
  );
}
