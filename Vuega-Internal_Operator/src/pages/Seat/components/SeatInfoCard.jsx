function DetailPill({ label, value }) {
  return (
    <div className="bg-white/70 rounded-lg border border-white/80 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wide text-gray-500 font-semibold">{label}</p>
      <p className="text-[13px] font-semibold text-gray-900 mt-0.5">{value}</p>
    </div>
  );
}

export default function SeatInfoCard({ seat, passenger, onClose }) {
  return (
    <div className="mt-1 bg-[#C6EDFF] rounded-2xl p-4 md:p-5 max-w-4xl mx-auto border border-blue-100">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-[10px] md:text-xs font-bold text-blue-800 uppercase">Seat {seat?.seatNumber}</p>
          <h3 className="text-base md:text-lg font-bold text-gray-900">
            {passenger?.name || 'Passenger not assigned'}
          </h3>
        </div>
        <button onClick={onClose} className="text-gray-500 text-xl leading-none" aria-label="Close">
          ×
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-2 text-sm">
        <DetailPill label="Passenger Name" value={passenger?.name || 'Not assigned'} />
        <DetailPill label="Passenger Number" value={passenger?.phone || 'Not available'} />
        <DetailPill label="Seat Type" value={seat?.type || 'seater'} />
        <DetailPill
          label="Status"
          value={passenger?.status ? String(passenger.status).replace('-', ' ') : 'available'}
        />
      </div>
    </div>
  );
}
