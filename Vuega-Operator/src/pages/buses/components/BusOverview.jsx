import { useState } from "react";
import Card from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FaBus, FaThLarge, FaChair, FaMapMarkerAlt, FaInfoCircle, FaLock } from "react-icons/fa";

const BUS_TYPE_OPTIONS = ["Seater", "Sleeper", "Semi-Sleeper"];

/**
 * Overview tab for an individual bus.
 * @param {Object}  bus        – bus data object
 * @param {boolean} isEditable – whether fields are editable
 */
const BusOverview = ({ bus, isEditable = false }) => {
 const [form, setForm] = useState({
   busType: bus.busType,
   totalSeats: bus.totalSeats,
   currentTrip: bus.currentTrip || "",
   layoutTemplate: bus.layoutTemplate,
 });

 const handleChange = (key, value) => {
   setForm((prev) => ({ ...prev, [key]: value }));
 };

 /* ── Read-only field card ── */
 const ReadOnlyCard = ({ icon, label, value, locked = false }) => (
   <Card>
     <div className="flex items-start gap-4">
       <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
         {icon}
       </div>
       <div className="flex flex-col flex-1">
         <span className="font-medium text-v-text-muted uppercase tracking-wider">
           {label}
         </span>
         <span className="font-semibold text-v-text mt-0.5">{value}</span>
       </div>
       {locked && (
         <FaLock size={12} className="text-v-text-placeholder mt-1" title="This field cannot be edited" />
       )}
     </div>
   </Card>
 );

 /* ── Editable field card ── */
 const EditableCard = ({ icon, label, children }) => (
   <Card>
     <div className="flex items-start gap-4">
       <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
         {icon}
       </div>
       <div className="flex flex-col flex-1 gap-1">
         <label className="font-medium text-v-text-muted uppercase tracking-wider">
           {label}
         </label>
         {children}
       </div>
     </div>
   </Card>
 );

 if (!isEditable) {
   /* ── Read-only view (original) ── */
   const fields = [
     { icon: <FaBus size={18} />, label: "Bus Number", value: bus.busNumber },
     { icon: <FaInfoCircle size={18} />, label: "Bus Type", value: bus.busType },
     { icon: <FaChair size={18} />, label: "Total Seats", value: bus.totalSeats },
     { icon: <FaMapMarkerAlt size={18} />, label: "Current Trip", value: bus.currentTrip || "—" },
     { icon: <FaThLarge size={18} />, label: "Layout Template", value: bus.layoutTemplate },
   ];

   return (
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
       {fields.map((field) => (
         <ReadOnlyCard key={field.label} icon={field.icon} label={field.label} value={field.value} />
       ))}
       <Card>
         <div className="flex items-start gap-4">
           <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
             <FaInfoCircle size={18} />
           </div>
           <div className="flex flex-col">
             <span className="font-medium text-v-text-muted uppercase tracking-wider">Status</span>
             <div className="mt-1"><StatusBadge status={bus.status} /></div>
           </div>
         </div>
       </Card>
     </div>
   );
 }

 /* ── Editable view ── */
 return (
   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
     {/* Bus Number — locked */}
     <ReadOnlyCard icon={<FaBus size={18} />} label="Bus Number" value={bus.busNumber} locked />

     {/* Bus Type — select */}
     <EditableCard icon={<FaInfoCircle size={18} />} label="Bus Type">
       <select
         value={form.busType}
         onChange={(e) => handleChange("busType", e.target.value)}
         className="w-full px-3 py-2 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
       >
         {BUS_TYPE_OPTIONS.map((opt) => (
           <option key={opt} value={opt}>{opt}</option>
         ))}
       </select>
     </EditableCard>

     {/* Total Seats — number input */}
     <EditableCard icon={<FaChair size={18} />} label="Total Seats">
       <input
         type="number"
         min={0}
         value={form.totalSeats}
         onChange={(e) => handleChange("totalSeats", parseInt(e.target.value, 10) || 0)}
         className="w-full px-3 py-2 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
       />
     </EditableCard>

     {/* Current Trip — text input */}
     <EditableCard icon={<FaMapMarkerAlt size={18} />} label="Current Trip">
       <input
         type="text"
         value={form.currentTrip}
         onChange={(e) => handleChange("currentTrip", e.target.value)}
         placeholder="e.g. Bangalore → Chennai"
         className="w-full px-3 py-2 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
       />
     </EditableCard>

     {/* Layout Template — text input */}
     <EditableCard icon={<FaThLarge size={18} />} label="Layout Template">
       <input
         type="text"
         value={form.layoutTemplate}
         onChange={(e) => handleChange("layoutTemplate", e.target.value)}
         className="w-full px-3 py-2 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
       />
     </EditableCard>

     {/* Status — read-only */}
     <Card>
       <div className="flex items-start gap-4">
         <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
           <FaInfoCircle size={18} />
         </div>
         <div className="flex flex-col">
           <span className="font-medium text-v-text-muted uppercase tracking-wider">Status</span>
           <div className="mt-1"><StatusBadge status={bus.status} /></div>
         </div>
       </div>
     </Card>
   </div>
 );
};

export default BusOverview;
