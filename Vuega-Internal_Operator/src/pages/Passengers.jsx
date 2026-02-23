import { useState, useMemo, useCallback, useEffect } from 'react';
import PageHeader from '../Navs/PageHeader';
import EmptyState from '../components/common/EmptyState';
import StatusBadge from '../components/common/StatusBadge';
import {
  FaUsers,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaCommentDots,
  FaCheck,
  FaTimes,
} from 'react-icons/fa';

const FILTERS = ['all', 'pending', 'boarded', 'no-show'];
const PAGE_SIZE = 10;
const STATUS_ORDER = { pending: 0, boarded: 1, 'no-show': 2 };

const MOCK_TRIP = {
  id: 'trip-001',
  busNumber: 'KA-01-F-1234',
  route: 'Bangalore → Chennai',
};

const MOCK_PASSENGERS = [
  { id: 'p-001', name: 'Arun Sharma', seatNumber: 1, phone: '+919876543210', boardingPoint: 'Majestic', status: 'pending', remark: '' },
  { id: 'p-002', name: 'Priya Nair', seatNumber: 2, phone: '+919876543211', boardingPoint: 'Majestic', status: 'pending', remark: '' },
  { id: 'p-003', name: 'Vikram Singh', seatNumber: 3, phone: '+919876543212', boardingPoint: 'Electronic City', status: 'boarded', remark: 'Window seat requested' },
  { id: 'p-004', name: 'Meena Kumari', seatNumber: 4, phone: '+919876543213', boardingPoint: 'Silk Board', status: 'pending', remark: '' },
  { id: 'p-005', name: 'Sanjay Patel', seatNumber: 5, phone: '+919876543214', boardingPoint: 'Majestic', status: 'no-show', remark: 'Called twice, unreachable' },
  { id: 'p-006', name: 'Deepa Rao', seatNumber: 6, phone: '+919876543215', boardingPoint: 'Electronic City', status: 'boarded', remark: '' },
  { id: 'p-007', name: 'Rahul Menon', seatNumber: 7, phone: '+919876543216', boardingPoint: 'Madiwala', status: 'pending', remark: '' },
  { id: 'p-008', name: 'Kavitha S', seatNumber: 8, phone: '+919876543217', boardingPoint: 'Silk Board', status: 'pending', remark: '' },
  { id: 'p-009', name: 'Manoj V', seatNumber: 9, phone: '+919876543218', boardingPoint: 'Majestic', status: 'boarded', remark: '' },
  { id: 'p-010', name: 'Anitha Raj', seatNumber: 10, phone: '+919876543219', boardingPoint: 'Electronic City', status: 'pending', remark: 'Needs wheelchair assistance' },
  { id: 'p-011', name: 'Sunil Das', seatNumber: 11, phone: '+919876543220', boardingPoint: 'Madiwala', status: 'pending', remark: '' },
  { id: 'p-012', name: 'Lakshmi B', seatNumber: 12, phone: '+919876543221', boardingPoint: 'Majestic', status: 'no-show', remark: '' },
];

export default function Passengers() {
  const trip = MOCK_TRIP;
  const [passengers, setPassengers] = useState(MOCK_PASSENGERS);
  const [updatingIds, setUpdatingIds] = useState(new Set());

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [remarkModal, setRemarkModal] = useState(null); // passengerId | null
  const [remarkText, setRemarkText] = useState('');

  const filtered = useMemo(() => {
    let list = passengers;

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          String(p.seatNumber).includes(q) ||
          p.boardingPoint?.toLowerCase().includes(q)
      );
    }

    // Filter
    if (filter !== 'all') {
      list = list.filter((p) => p.status === filter);
    }

    list = [...list].sort((a, b) => {
      const statusDiff = (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
      if (statusDiff !== 0) return statusDiff;
      return (a.seatNumber ?? 9999) - (b.seatNumber ?? 9999);
    });

    return list;
  }, [passengers, search, filter]);

  // Reset page when search/filter changes
  useEffect(() => setPage(1), [search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const setPassengerStatus = useCallback((id, status) => {
    setUpdatingIds((prev) => new Set(prev).add(id));
    setTimeout(() => {
      setPassengers((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, 200);
  }, []);

  const handleBoarded = useCallback((id) => setPassengerStatus(id, 'boarded'), [setPassengerStatus]);

  const handleNoShow = useCallback((id) => setPassengerStatus(id, 'no-show'), [setPassengerStatus]);

  const handleRemarkSubmit = useCallback(async () => {
    if (!remarkModal || !remarkText.trim()) return;
    setPassengers((prev) =>
      prev.map((p) => (p.id === remarkModal ? { ...p, remark: remarkText.trim() } : p))
    );
    setRemarkModal(null);
    setRemarkText('');
  }, [remarkModal, remarkText]);

  return (
    <div>
      <PageHeader
        title="Passengers"
        subtitle={trip ? `${trip.route} — Bus #${trip.busNumber}` : undefined}
      />
      {/* Search */}
      <div className="px-4 md:px-6 lg:px-8 pt-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name or seat..."
          className="w-full h-11 md:h-12 px-4 rounded-xl border border-gray-200 text-sm md:text-base md:text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6EDFF] focus:border-transparent"
        />
      </div>

      {/* Filter Tabs */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 flex gap-2 overflow-x-auto overflow-y-hidden passenger-filters-scroll pb-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-xs font-semibold capitalize transition-colors ${
              filter === f
                ? 'bg-[#C6EDFF] text-[#960000]'
                : 'bg-gray-100 text-gray-600 active:bg-gray-200'
            }`}
          >
            {f === 'all'
              ? `All (${passengers.length})`
              : f === 'pending'
              ? `Pending (${passengers.filter((p) => p.status === 'pending').length})`
              : f === 'boarded'
              ? `Boarded (${passengers.filter((p) => p.status === 'boarded').length})`
              : `No-show (${passengers.filter((p) => p.status === 'no-show').length})`}
          </button>
        ))}
      </div>

      {/* Passenger List */}
      <div className="px-4 md:px-6 lg:px-8 pt-3 pb-4">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<FaUsers className="text-gray-300" />}
            title="No Passengers Found"
            description={search ? 'Try a different search term.' : 'No passengers match this filter.'}
          />
        ) : (
          <>
          <div className="space-y-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:space-y-0">
          {paginated.map((passenger) => (
            <PassengerCard
              key={passenger.id}
              passenger={passenger}
              isUpdating={updatingIds.has(passenger.id)}
              onBoarded={handleBoarded}
              onNoShow={handleNoShow}
              onAddRemark={() => {
                setRemarkModal(passenger.id);
                setRemarkText(passenger.remark || '');
              }}
            />
          ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Prev
              </button>
              <span className="text-sm font-medium text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 active:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
          </>
        )}
      </div>

      {/* Remark Modal */}
      {remarkModal && (
        <RemarkModal
          remarkText={remarkText}
          onChangeText={setRemarkText}
          onSubmit={handleRemarkSubmit}
          onClose={() => {
            setRemarkModal(null);
            setRemarkText('');
          }}
        />
      )}
    </div>
  );
}

function PassengerCard({ passenger, isUpdating, onBoarded, onNoShow, onAddRemark }) {
  const { id, name, seatNumber, phone, boardingPoint, status } = passenger;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 md:p-5 hover:shadow-sm transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-400">Seat {seatNumber}</span>
            <StatusBadge status={status} />
          </div>
          <h3 className="text-base font-semibold text-gray-900 truncate">{name}</h3>
          {boardingPoint && (
            <p className="text-xs text-gray-500 mt-0.5 inline-flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-[11px] text-[#960000]" />
              {boardingPoint}
            </p>
          )}
        </div>

        {phone && (
          <a
            href={`tel:${phone}`}
            className="shrink-0 w-10 h-10 bg-[#C6EDFF] rounded-full flex items-center justify-center text-lg active:scale-95"
            aria-label={`Call ${name}`}
          >
            <FaPhoneAlt className="text-[14px] text-[#960000]" />
          </a>
        )}
      </div>

      {/* Remark */}
      {passenger.remark && (
        <p className="text-xs text-gray-500 italic mb-3 truncate inline-flex items-center gap-1.5">
          <FaCommentDots className="text-[11px] text-gray-400" />
          {passenger.remark}
        </p>
      )}

      {/* Actions */}
      {status === 'pending' && (
        <div className="flex gap-2">
          <button
            onClick={() => onBoarded(id)}
            disabled={isUpdating}
            className="flex-1 h-9 bg-[#C6EDFF] text-[#960000] text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.97] disabled:opacity-50"
          >
            {isUpdating ? (
              <span className="w-3.5 h-3.5 border-2 border-[#960000]/30 border-t-[#960000] rounded-full animate-spin" />
            ) : (
              <FaCheck className="text-[11px]" />
            )}
            Boarded
          </button>
          <button
            onClick={() => onNoShow(id)}
            disabled={isUpdating}
            className="flex-1 h-9 bg-[#960000] text-white text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 active:scale-[0.97] disabled:opacity-50"
          >
            {isUpdating ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaTimes className="text-[11px]" />
            )}
            No-show
          </button>
        </div>
      )}

      {/* Add remark link */}
      <button
        onClick={onAddRemark}
        className="mt-2 text-xs font-medium text-gray-400 active:text-gray-600"
      >
        + Add remark
      </button>
    </div>
  );
}

function RemarkModal({ remarkText, onChangeText, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end md:items-center justify-center md:p-6">
      <div className="w-full max-w-lg bg-white rounded-t-2xl md:rounded-2xl p-5 pb-8 md:pb-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-gray-900">Add Remark</h3>
          <button
            onClick={onClose}
            className="text-gray-400 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <textarea
          value={remarkText}
          onChange={(e) => onChangeText(e.target.value)}
          placeholder="Enter a short remark..."
          maxLength={200}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C6EDFF] resize-none"
        />
        <button
          onClick={onSubmit}
          disabled={!remarkText.trim()}
          className="w-full h-10 bg-[#C6EDFF] text-[#960000] text-xs font-semibold rounded-xl disabled:opacity-50 active:scale-[0.98]"
        >
          Save Remark
        </button>
      </div>
    </div>
  );
}