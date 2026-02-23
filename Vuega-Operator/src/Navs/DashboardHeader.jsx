import { FaSearch, FaBell, FaChevronDown, FaUserCircle, FaBars } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const pageTitles = {
 "/dashboard": "Dashboard",
 "/buses": "Buses",
 "/routes": "Routes",
 "/trips": "Trips",
 "/maintenance": "Maintenance",
 "/layout-designer": "Layout Designer",
};

const DashboardHeader = ({ onMenuClick }) => {
 const location = useLocation();

 // Match exact path first, then check prefix for dynamic routes
 const currentTitle =
 pageTitles[location.pathname] ||
 (location.pathname.startsWith("/buses/") ? "Bus Details" : "Dashboard");

 return (
 <header className="flex items-center justify-between px-6 py-3 w-full bg-v-primary-bg border-b border-v-border shrink-0">
 {/* Left: Mobile menu + Page title */}
 <div className="flex items-center gap-3">
 <button
 onClick={onMenuClick}
 className="p-1.5 rounded-lg hover:bg-v-secondary text-v-text-muted sm:hidden"
 >
 <FaBars className="w-5 h-5" />
 </button>
 <div>
 <h1 className=" font-bold text-v-text">{currentTitle}</h1>
 <p className=" text-v-text-muted hidden sm:block">
 Technical Operator Panel
 </p>
 </div>
 </div>

 {/* Right: Notifications + Profile */}
 <div className="flex items-center gap-3">
 <button className="relative p-2 text-v-text-muted rounded-lg hover:bg-v-secondary transition-colors">
 <FaBell className="w-5 h-5" />
 <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-v-critical rounded-full border-2 border-white" />
 </button>

 <div className="h-6 w-px bg-v-border" />

 <button className="flex items-center gap-2">
 <div className="flex items-center justify-center w-8 h-8 bg-v-accent rounded-full">
 <FaUserCircle className="w-4 h-4 text-v-text" />
 </div>
 <div className="hidden sm:flex flex-col items-start">
 <span className=" font-semibold text-v-text">Operator</span>
 <span className=" text-v-text-muted leading-tight">
 Technical Ops
 </span>
 </div>
 <FaChevronDown className="w-3 h-3 text-v-text-muted hidden sm:block" />
 </button>
 </div>
 </header>
 );
};

export default DashboardHeader;