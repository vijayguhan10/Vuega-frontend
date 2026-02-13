import Card from "../../../components/ui/Card";
import StatusBadge from "../../../components/ui/StatusBadge";
import { FaBus, FaThLarge, FaChair, FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa";

/**
 * Overview tab for an individual bus.
 * @param {Object} bus – bus data object
 */
const BusOverview = ({ bus }) => {
  const fields = [
    {
      icon: <FaBus size={18} />,
      label: "Bus Number",
      value: bus.busNumber,
    },
    {
      icon: <FaInfoCircle size={18} />,
      label: "Bus Type",
      value: bus.busType,
    },
    {
      icon: <FaChair size={18} />,
      label: "Total Seats",
      value: bus.totalSeats,
    },
    {
      icon: <FaMapMarkerAlt size={18} />,
      label: "Current Trip",
      value: bus.currentTrip || "—",
    },
    {
      icon: <FaThLarge size={18} />,
      label: "Layout Template",
      value: bus.layoutTemplate,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {fields.map((field) => (
        <Card key={field.label}>
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
              {field.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-v-text-muted uppercase tracking-wider">
                {field.label}
              </span>
              <span className="text-sm font-semibold text-v-text mt-0.5">
                {field.value}
              </span>
            </div>
          </div>
        </Card>
      ))}

      {/* Status card */}
      <Card>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-v-accent/30 flex items-center justify-center text-v-text-secondary">
            <FaInfoCircle size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-v-text-muted uppercase tracking-wider">
              Status
            </span>
            <div className="mt-1">
              <StatusBadge status={bus.status} />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BusOverview;
