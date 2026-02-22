import { FaUsers } from 'react-icons/fa';
import Card from '../../../components/ui/Card';

/* ══════════════════════════════════════════════════════
   PassengerList — placeholder component
   Will be implemented when booking module is built.
   ══════════════════════════════════════════════════════ */

const PassengerList = () => {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-v-secondary flex items-center justify-center mb-4">
          <FaUsers size={28} className="text-v-text-muted" />
        </div>
        <h3 className="font-semibold text-v-text">Passenger List</h3>
        <p className="text-v-text-muted mt-1 max-w-sm">
          Passenger details will appear here once the booking module is integrated.
          This section will show passenger names, seat assignments, and booking status.
        </p>
        <span className="mt-4 px-3 py-1.5 rounded-lg bg-v-secondary border border-v-secondary-border text-v-text-muted font-medium">
          Coming Soon
        </span>
      </div>
    </Card>
  );
};

export default PassengerList;
