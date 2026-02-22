import { useEffect, useRef } from "react";
import {
 FaTachometerAlt,
 FaBus,
 FaMapMarkerAlt,
 FaCalendarAlt,
 FaWrench,
 FaChair,
 FaSignOutAlt,
 FaChevronLeft,
 FaCog,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
 { name: "Dashboard", icon: FaTachometerAlt, path: "/dashboard" },
 { name: "Buses", icon: FaBus, path: "/buses" },
 { name: "Routes", icon: FaMapMarkerAlt, path: "/routes" },
 { name: "Trips", icon: FaCalendarAlt, path: "/trips" },
 { name: "Maintenance", icon: FaWrench, path: "/maintenance" },
 { name: "Layout Designer", icon: FaChair, path: "/layout-templates/create" },
];

const SideBar = ({ isOpen, onClose }) => {
 const sidebarRef = useRef(null);
 const navigate = useNavigate();

 useEffect(() => {
 const handleOutsideClick = (event) => {
 if (
 sidebarRef.current &&
 !sidebarRef.current.contains(event.target) &&
 isOpen
 ) {
 onClose();
 }
 };

 document.addEventListener("mousedown", handleOutsideClick);
 return () => document.removeEventListener("mousedown", handleOutsideClick);
 }, [isOpen, onClose]);

 const handleLogout = () => {
 // TODO: Call authService.logout() when backend is ready
 localStorage.removeItem("token");
 navigate("/");
 };

 return (
 <>
 {/* Mobile overlay */}
 {isOpen && (
 <div
 className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 sm:hidden"
 onClick={onClose}
 />
 )}

 <aside
 ref={sidebarRef}
 className={`fixed top-0 left-0 z-40 w-64 h-screen bg-v-primary-bg border-r border-v-border transition-transform duration-300 ease-in-out ${
 isOpen ? "translate-x-0" : "-translate-x-full"
 } sm:translate-x-0`}
 >
 <div className="flex flex-col h-full px-4 py-5">
 {/* Logo + Mobile close */}
 <div className="flex items-center justify-between mb-8 px-2">
 <div className="flex items-center gap-3">
 <div className="bg-v-accent p-2 rounded-xl shadow-sm">
 <FaCog className="w-5 h-5 text-v-text" />
 </div>
 <div>
 <h1 className=" font-bold text-v-text">Vuega</h1>
 <p className=" text-v-text-muted leading-tight">
 Technical Operator
 </p>
 </div>
 </div>
 <button
 onClick={onClose}
 className="p-1 rounded-lg hover:bg-v-secondary text-v-text-muted sm:hidden"
 >
 <FaChevronLeft className="w-5 h-5" />
 </button>
 </div>

 {/* Navigation Label */}
 <p className=" font-semibold text-v-text-muted uppercase tracking-wider px-3 mb-2">
 Operations
 </p>

 {/* Menu Items */}
 <nav className="flex-1 space-y-1">
 {menuItems.map(({ name, icon: Icon, path }) => (
 <NavLink
 key={path}
 to={path}
 onClick={onClose}
 className={({ isActive }) =>
 `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${
 isActive
 ? "bg-v-accent text-v-text shadow-sm"
 : "text-v-text-secondary hover:bg-v-secondary hover:text-v-text"
 }`
 }
 >
 {({ isActive }) => (
 <>
 <Icon
 size={18}
 className={isActive ? "text-v-text" : "text-v-text-muted"}
 />
 <span>{name}</span>
 </>
 )}
 </NavLink>
 ))}
 </nav>

 {/* Logout */}
 <div className="mt-auto pt-4 border-t border-v-border">
 <button
 onClick={handleLogout}
 className="w-full flex items-center gap-3 text-v-critical hover:bg-v-critical-light px-3 py-2.5 rounded-lg font-medium transition-colors"
 >
 <FaSignOutAlt size={18} />
 Logout
 </button>
 </div>
 </div>
 </aside>
 </>
 );
};

export default SideBar;