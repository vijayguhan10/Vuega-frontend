import { useMemo } from 'react';
import { FaUsers, FaUser, FaPhone, FaEnvelope, FaVenusMars } from 'react-icons/fa';
import Card from '../../../components/ui/Card';
import Table from '../../../components/ui/Table';
import StatusBadge from '../../../components/ui/StatusBadge';
import { flattenSeats } from '../data/dummyTrips';

/* ══════════════════════════════════════════════════════
   PassengerList — shows all booked passengers with
   seat number, name, phone, email, gender, age.
   ══════════════════════════════════════════════════════ */

const COLUMNS = [
  { key: 'seatNumber', label: 'Seat #', sortable: true },
  { key: 'name', label: 'Passenger Name', sortable: true },
  { key: 'phone', label: 'Phone', sortable: false },
  { key: 'email', label: 'Email', sortable: false },
  { key: 'gender', label: 'Gender', sortable: true },
  { key: 'age', label: 'Age', sortable: true },
  { key: 'type', label: 'Seat Type', sortable: true },
  { key: 'price', label: 'Fare', sortable: true },
];

const PassengerList = ({ tripSeatGrid }) => {
  const passengers = useMemo(() => {
    if (!tripSeatGrid) return [];
    const flat = flattenSeats(tripSeatGrid);
    return flat
      .filter((s) => s.status === 'booked' && s.passenger)
      .map((s) => ({
        id: s.id,
        seatNumber: s.seatNumber,
        name: s.passenger.name,
        phone: s.passenger.phone,
        email: s.passenger.email || '—',
        gender: s.passenger.gender,
        age: s.passenger.age,
        type: s.type,
        price: s.finalPrice,
      }));
  }, [tripSeatGrid]);

  if (!tripSeatGrid || passengers.length === 0) {
    return (
      <Card>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-v-secondary flex items-center justify-center mb-4">
            <FaUsers size={28} className="text-v-text-muted" />
          </div>
          <h3 className="font-semibold text-v-text">No Passengers Yet</h3>
          <p className="text-v-text-muted mt-1 max-w-sm">
            No seats have been booked for this trip. Book seats from the Seat Map
            tab to see passenger details here.
          </p>
        </div>
      </Card>
    );
  }

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'seatNumber':
        return (
          <span className="inline-flex items-center gap-1.5 font-semibold text-v-text">
            #{row.seatNumber}
          </span>
        );
      case 'name':
        return (
          <span className="flex items-center gap-2">
            <FaUser size={12} className="text-v-text-muted" />
            <span className="font-medium text-v-text">{row.name}</span>
          </span>
        );
      case 'phone':
        return (
          <span className="flex items-center gap-2">
            <FaPhone size={11} className="text-v-text-muted" />
            {row.phone}
          </span>
        );
      case 'email':
        return (
          <span className="flex items-center gap-2">
            <FaEnvelope size={11} className="text-v-text-muted" />
            {row.email}
          </span>
        );
      case 'gender':
        return <span className="capitalize">{row.gender}</span>;
      case 'age':
        return row.age;
      case 'type':
        return <StatusBadge status={row.type} />;
      case 'price':
        return <span className="font-semibold">₹{row.price}</span>;
      default:
        return row[col.key];
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Summary bar */}
      <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-v-secondary/40 border border-v-secondary-border">
        <span className="font-semibold text-v-text flex items-center gap-2">
          <FaUsers size={16} /> {passengers.length} Passenger{passengers.length !== 1 ? 's' : ''}
        </span>
        <span className="text-v-text-muted">
          Total Fare: <span className="font-semibold text-v-text">₹{passengers.reduce((sum, p) => sum + p.price, 0)}</span>
        </span>
      </div>

      <Card>
        <Table columns={COLUMNS} data={passengers} renderCell={renderCell} />
      </Card>
    </div>
  );
};

export default PassengerList;
