import { FaEye, FaFilter } from "react-icons/fa";

const todayTrips = [
 {
 id: "TR-2041",
 route: "Bangalore → Chennai",
 busNumber: "KA01 AB 1234",
 departure: "06:00 AM",
 arrival: "12:30 PM",
 status: "In Transit",
 driver: "Ramesh Kumar",
 },
 {
 id: "TR-2042",
 route: "Bangalore → Hyderabad",
 busNumber: "KA53 MN 8899",
 departure: "07:30 AM",
 arrival: "04:00 PM",
 status: "In Transit",
 driver: "Suresh Reddy",
 },
 {
 id: "TR-2043",
 route: "Chennai → Bangalore",
 busNumber: "TN09 XY 9876",
 departure: "10:00 AM",
 arrival: "04:30 PM",
 status: "Boarding",
 driver: "Venkat Rao",
 },
 {
 id: "TR-2044",
 route: "Bangalore → Mysore",
 busNumber: "KA51 EV 0001",
 departure: "02:00 PM",
 arrival: "05:30 PM",
 status: "Scheduled",
 driver: "Pradeep S",
 },
 {
 id: "TR-2045",
 route: "Hyderabad → Vijayawada",
 busNumber: "TS08 ZZ 1111",
 departure: "10:00 PM",
 arrival: "04:00 AM",
 status: "Scheduled",
 driver: "Anil Sharma",
 },
 {
 id: "TR-2046",
 route: "Bangalore → Mumbai",
 busNumber: "KA02 XY 5555",
 departure: "11:15 PM",
 arrival: "10:00 AM",
 status: "Delayed",
 driver: "Ravi Patil",
 },
];

const statusStyles = {
 "In Transit": "bg-v-accent text-v-text border border-v-accent-border",
 Boarding: "bg-v-secondary text-v-text border border-v-secondary-border",
 Scheduled: "bg-v-primary-bg text-v-text-secondary border border-v-border",
 Delayed: "bg-v-critical-light text-v-critical border border-v-critical-border",
};

const TodayTripsTable = () => {
 return (
 <div className="bg-v-primary-bg border border-v-border rounded-xl shadow-sm overflow-hidden">
 {/* Header */}
 <div className="px-6 py-5 border-b border-v-border flex justify-between items-center">
 <div>
 <h3 className="text-v-text font-bold">Today's Trips</h3>
 <p className="text-v-text-muted mt-0.5">
 {todayTrips.length} trips scheduled for today
 </p>
 </div>
 <button className="flex items-center gap-1.5 text-v-text-muted hover:text-v-text font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-v-secondary">
 <FaFilter size={16} />
 Filter
 </button>
 </div>

 {/* Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-v-secondary/50 uppercase text-v-text-muted border-b border-v-border">
 <th className="px-6 py-3 font-semibold tracking-wider">Route</th>
 <th className="px-6 py-3 font-semibold tracking-wider">
 Bus Number
 </th>
 <th className="px-6 py-3 font-semibold tracking-wider">
 Departure
 </th>
 <th className="px-6 py-3 font-semibold tracking-wider">
 Arrival
 </th>
 <th className="px-6 py-3 font-semibold tracking-wider">Status</th>
 <th className="px-6 py-3 font-semibold tracking-wider">
 Assigned Driver
 </th>
 <th className="px-6 py-3 font-semibold tracking-wider text-right">
 Action
 </th>
 </tr>
 </thead>
 <tbody className="divide-y divide-v-border-light ">
 {todayTrips.map((trip) => (
 <tr
 key={trip.id}
 className="hover:bg-v-secondary/30 transition-colors"
 >
 <td className="px-6 py-4">
 <span className="font-semibold text-v-text">
 {trip.route}
 </span>
 </td>
 <td className="px-6 py-4 text-v-text-secondary font-mono ">
 {trip.busNumber}
 </td>
 <td className="px-6 py-4 text-v-text-secondary">
 {trip.departure}
 </td>
 <td className="px-6 py-4 text-v-text-secondary">
 {trip.arrival}
 </td>
 <td className="px-6 py-4">
 <span
 className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium ${
 statusStyles[trip.status] || statusStyles.Scheduled
 }`}
 >
 {trip.status}
 </span>
 </td>
 <td className="px-6 py-4 text-v-text-secondary">
 {trip.driver}
 </td>
 <td className="px-6 py-4 text-right">
 <button className="inline-flex items-center gap-1 text-v-text-muted hover:text-v-text font-medium px-2.5 py-1.5 rounded-lg hover:bg-v-accent/40 transition-colors">
 <FaEye size={14} />
 View
 </button>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 );
};

export default TodayTripsTable;
