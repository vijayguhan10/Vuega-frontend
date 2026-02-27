import { FaExclamationTriangle } from "react-icons/fa";

const maintenanceAlerts = [
 {
 id: 1,
 busNumber: "KA01 AB 1234",
 alertType: "Insurance Expiry",
 expiryDate: "18 Feb 2026",
 severity: "critical",
 },
 {
 id: 2,
 busNumber: "TN09 XY 9876",
 alertType: "Fitness Certificate",
 expiryDate: "22 Feb 2026",
 severity: "warning",
 },
 {
 id: 3,
 busNumber: "KA53 MN 8899",
 alertType: "Oil Change Due",
 expiryDate: "25 Feb 2026",
 severity: "info",
 },
];

const severityStyles = {
 critical: {
 bg: "bg-v-critical-light",
 text: "text-v-critical",
 border: "border-v-critical-border",
 dot: "bg-v-critical",
 },
 warning: {
 bg: "bg-v-secondary",
 text: "text-v-text",
 border: "border-v-secondary-border",
 dot: "bg-v-secondary-hover",
 },
 info: {
 bg: "bg-v-accent",
 text: "text-v-text",
 border: "border-v-accent-border",
 dot: "bg-v-accent-dark",
 },
};

const MaintenanceAlerts = () => {
 return (
 <div className="bg-v-primary-bg border border-v-border rounded-xl shadow-sm overflow-hidden">
 {/* Header */}
 <div className="px-6 py-5 border-b border-v-border flex items-center gap-2">
 <FaExclamationTriangle size={18} className="text-v-critical" />
 <div>
 <h3 className="text-v-text font-bold">Maintenance Alerts</h3>
 <p className="text-v-text-muted mt-0.5">
 Items requiring immediate attention
 </p>
 </div>
 </div>

 {/* Alerts List */}
 <div className="divide-y divide-v-border-light">
 {maintenanceAlerts.map((alert) => {
 const style = severityStyles[alert.severity] || severityStyles.info;
 return (
 <div
 key={alert.id}
 className="flex items-center justify-between px-6 py-4 hover:bg-v-secondary/20 transition-colors"
 >
 <div className="flex items-center gap-4">
 <span
 className={`w-2 h-2 rounded-full ${style.dot} shrink-0`}
 />
 <div>
 <p className=" font-semibold text-v-text">
 {alert.busNumber}
 </p>
 <p className=" text-v-text-muted mt-0.5">
 {alert.alertType}
 </p>
 </div>
 </div>
 <div className="text-right">
 <span
 className={`inline-flex items-center rounded-full px-2.5 py-1 font-medium ${style.bg} ${style.text} border ${style.border}`}
 >
 {alert.expiryDate}
 </span>
 </div>
 </div>
 );
 })}
 </div>

 {/* Footer */}
 <div className="px-6 py-3 border-t border-v-border bg-v-secondary/30 flex justify-center">
 <button className=" font-semibold text-v-text-secondary hover:text-v-text transition-colors">
 View All Maintenance Records
 </button>
 </div>
 </div>
 );
};

export default MaintenanceAlerts;
