const upcomingTrips = [
  {
    id: "TR-2050",
    date: "14 Feb 2026",
    route: "Bangalore → Goa",
    bus: "KA01 CD 7777",
    departure: "06:00 AM",
    status: "Confirmed",
  },
  {
    id: "TR-2051",
    date: "14 Feb 2026",
    route: "Chennai → Coimbatore",
    bus: "TN09 PQ 3344",
    departure: "08:00 AM",
    status: "Confirmed",
  },
  {
    id: "TR-2052",
    date: "14 Feb 2026",
    route: "Hyderabad → Bangalore",
    bus: "TS08 AB 2200",
    departure: "09:30 PM",
    status: "Confirmed",
  },
  {
    id: "TR-2053",
    date: "15 Feb 2026",
    route: "Bangalore → Hubli",
    bus: "KA51 EV 0001",
    departure: "07:00 AM",
    status: "Pending",
  },
  {
    id: "TR-2054",
    date: "15 Feb 2026",
    route: "Mumbai → Pune",
    bus: "MH12 PQ 5555",
    departure: "06:30 AM",
    status: "Pending",
  },
];

const statusStyles = {
  Confirmed: "bg-v-accent text-v-text border border-v-accent-border",
  Pending: "bg-v-secondary text-v-text-secondary border border-v-secondary-border",
};

const UpcomingTripsTable = () => {
  return (
    <div className="bg-v-primary-bg border border-v-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-v-border">
        <h3 className="text-v-text text-lg font-bold">Upcoming Trips</h3>
        <p className="text-v-text-muted text-xs mt-0.5">
          Next 3 days schedule
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-v-secondary/50 text-[11px] uppercase text-v-text-muted border-b border-v-border">
              <th className="px-6 py-3 font-semibold tracking-wider">Date</th>
              <th className="px-6 py-3 font-semibold tracking-wider">Route</th>
              <th className="px-6 py-3 font-semibold tracking-wider">Bus</th>
              <th className="px-6 py-3 font-semibold tracking-wider">
                Departure
              </th>
              <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-v-border-light text-sm">
            {upcomingTrips.map((trip) => (
              <tr
                key={trip.id}
                className="hover:bg-v-secondary/30 transition-colors"
              >
                <td className="px-6 py-4 text-v-text-secondary">
                  {trip.date}
                </td>
                <td className="px-6 py-4 font-semibold text-v-text">
                  {trip.route}
                </td>
                <td className="px-6 py-4 text-v-text-secondary font-mono text-xs">
                  {trip.bus}
                </td>
                <td className="px-6 py-4 text-v-text-secondary">
                  {trip.departure}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[trip.status] || statusStyles.Pending
                    }`}
                  >
                    {trip.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UpcomingTripsTable;
