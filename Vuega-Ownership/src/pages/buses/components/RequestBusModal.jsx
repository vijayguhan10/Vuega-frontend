import { useState } from "react";
import Modal from "../../../components/ui/Modal";
import { FaPaperPlane } from "react-icons/fa";

const LAYOUT_OPTIONS = [
 "2+2 Seater (40 seats)",
 "2+1 Seater (30 seats)",
 "2+1 Sleeper (24 berths)",
 "2+2 Semi-Sleeper (36 seats)",
];

const BUS_TYPES = ["Seater", "Sleeper", "Semi-Sleeper"];

/**
 * Modal for submitting a bus creation request.
 * The bus is added with status "pending-approval" and layoutStatus "Not Configured".
 * Super Admin must approve before the operator can configure layout or schedule trips.
 *
 * @param {boolean} isOpen
 * @param {() => void} onClose
 * @param {(newBus: Object) => void} onSubmit – callback to add bus to parent state
 */
const RequestBusModal = ({ isOpen, onClose, onSubmit }) => {
 const [form, setForm] = useState({
 busNumber: "",
 busType: "",
 expectedLayout: "",
 notes: "",
 });

 const handleChange = (e) => {
 setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
 };

 const handleSubmit = (e) => {
 e.preventDefault();

 const newBus = {
 id: `bus-${Date.now()}`,
 busNumber: form.busNumber,
 busType: form.busType,
 layoutTemplate: form.expectedLayout,
 totalSeats: 0,
 status: "pending-approval",
 layoutStatus: "Not Configured",
 currentTrip: "—",
 notes: form.notes,
 };

 // TODO: POST to /api/buses/request when backend is ready
 console.log("Bus Creation Request payload:", newBus);

 if (onSubmit) onSubmit(newBus);
 onClose();
 setForm({ busNumber: "", busType: "", expectedLayout: "", notes: "" });
 };

 return (
 <Modal isOpen={isOpen} onClose={onClose} title="Request New Bus">
 <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-v-secondary border border-v-secondary-border">
 <p className=" text-v-text-secondary">
 This request will be sent to the Super Admin for approval. Once
 approved, you can configure the seat layout and schedule trips.
 </p>
 </div>

 <form onSubmit={handleSubmit} className="flex flex-col gap-4">
 {/* Bus Number Plate */}
 <div className="flex flex-col gap-1.5">
 <label className=" font-semibold text-v-text-secondary uppercase tracking-wider">
 Bus Number Plate
 </label>
 <input
 type="text"
 name="busNumber"
 value={form.busNumber}
 onChange={handleChange}
 placeholder="e.g. KA01 AB 1234"
 required
 className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
 />
 </div>

 {/* Bus Type */}
 <div className="flex flex-col gap-1.5">
 <label className=" font-semibold text-v-text-secondary uppercase tracking-wider">
 Bus Type
 </label>
 <select
 name="busType"
 value={form.busType}
 onChange={handleChange}
 required
 className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
 >
 <option value="" disabled>
 Select bus type
 </option>
 {BUS_TYPES.map((type) => (
 <option key={type} value={type}>
 {type}
 </option>
 ))}
 </select>
 </div>

 {/* Expected Layout Type */}
 <div className="flex flex-col gap-1.5">
 <label className=" font-semibold text-v-text-secondary uppercase tracking-wider">
 Expected Layout Type
 </label>
 <select
 name="expectedLayout"
 value={form.expectedLayout}
 onChange={handleChange}
 required
 className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors"
 >
 <option value="" disabled>
 Select expected layout
 </option>
 {LAYOUT_OPTIONS.map((layout) => (
 <option key={layout} value={layout}>
 {layout}
 </option>
 ))}
 </select>
 </div>

 {/* Notes (optional) */}
 <div className="flex flex-col gap-1.5">
 <label className=" font-semibold text-v-text-secondary uppercase tracking-wider">
 Notes <span className="text-v-text-placeholder font-normal normal-case">(optional)</span>
 </label>
 <textarea
 name="notes"
 value={form.notes}
 onChange={handleChange}
 rows={3}
 placeholder="Any additional details for the admin…"
 className="w-full px-3.5 py-2.5 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder:text-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent focus:border-v-accent-border transition-colors resize-none"
 />
 </div>

 {/* Actions */}
 <div className="flex items-center justify-end gap-3 pt-3 border-t border-v-border">
 <button
 type="button"
 onClick={onClose}
 className="px-4 py-2 rounded-lg font-medium text-v-text-secondary border border-v-border hover:bg-v-secondary transition-colors"
 >
 Cancel
 </button>
 <button
 type="submit"
 className="inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold bg-v-accent hover:bg-v-accent-hover text-v-text border border-v-accent-border transition-colors"
 >
 <FaPaperPlane size={14} />
 Submit Request
 </button>
 </div>
 </form>
 </Modal>
 );
};

export default RequestBusModal;
