import Card from "../../../components/ui/Card";

/**
 * Read-only seat layout grid for a bus.
 * @param {Object} bus – bus data object
 */

// Dummy seat data: 2+2 layout with 10 rows = 40 seats
const generateSeats = (totalSeats) => {
 const seats = [];
 const seatsPerRow = 4;
 const rows = Math.ceil(totalSeats / seatsPerRow);

 for (let row = 0; row < rows; row++) {
 for (let col = 0; col < seatsPerRow; col++) {
 const seatNum = row * seatsPerRow + col + 1;
 if (seatNum > totalSeats) break;
 seats.push({
 number: seatNum,
 row: row + 1,
 col: col + 1,
 isAisle: col === 1, // aisle gap after seat 2
 });
 }
 }
 return seats;
};

const BusLayoutView = ({ bus }) => {
 const seats = generateSeats(bus.totalSeats || 40);
 const seatsPerRow = 4;
 const rows = Math.ceil(seats.length / seatsPerRow);

 return (
 <Card>
 <div className="flex flex-col gap-4">
 <div className="flex items-center justify-between">
 <div>
 <h4 className=" font-semibold text-v-text">
 Seat Layout — {bus.layoutTemplate}
 </h4>
 <p className=" text-v-text-muted mt-0.5">
 {bus.totalSeats} seats • 2+2 configuration • Read-only view
 </p>
 </div>
 <div className="flex items-center gap-3 text-v-text-muted">
 <span className="flex items-center gap-1.5">
 <span className="w-4 h-4 rounded bg-v-accent/40 border border-v-accent-border" />
 Available
 </span>
 <span className="flex items-center gap-1.5">
 <span className="w-4 h-4 rounded bg-v-secondary border border-v-secondary-border" />
 Booked
 </span>
 </div>
 </div>

 {/* Bus frame */}
 <div className="bg-v-secondary/20 border border-v-border rounded-lg p-6 flex flex-col items-center gap-1 max-w-md mx-auto w-full">
 {/* Driver area */}
 <div className="w-full flex justify-end mb-3 pr-2">
 <div className="w-8 h-8 rounded-md bg-v-text-muted/20 border border-v-border flex items-center justify-center">
 <span className=" font-bold text-v-text-muted">D</span>
 </div>
 </div>

 {/* Seat grid */}
 {Array.from({ length: rows }).map((_, rowIdx) => {
 const rowSeats = seats.slice(
 rowIdx * seatsPerRow,
 (rowIdx + 1) * seatsPerRow
 );
 return (
 <div key={rowIdx} className="flex items-center gap-1 w-full justify-center">
 {/* Left pair */}
 <div className="flex gap-1">
 {rowSeats.slice(0, 2).map((seat) => (
 <div
 key={seat.number}
 className={`w-10 h-10 rounded-md flex items-center justify-center font-semibold border transition-colors ${
 seat.number % 3 === 0
 ? "bg-v-secondary border-v-secondary-border text-v-text-secondary"
 : "bg-v-accent/40 border-v-accent-border text-v-text-secondary"
 }`}
 >
 {seat.number}
 </div>
 ))}
 </div>

 {/* Aisle */}
 <div className="w-6" />

 {/* Right pair */}
 <div className="flex gap-1">
 {rowSeats.slice(2, 4).map((seat) => (
 <div
 key={seat.number}
 className={`w-10 h-10 rounded-md flex items-center justify-center font-semibold border transition-colors ${
 seat.number % 5 === 0
 ? "bg-v-secondary border-v-secondary-border text-v-text-secondary"
 : "bg-v-accent/40 border-v-accent-border text-v-text-secondary"
 }`}
 >
 {seat.number}
 </div>
 ))}
 </div>
 </div>
 );
 })}
 </div>
 </div>
 </Card>
 );
};

export default BusLayoutView;
