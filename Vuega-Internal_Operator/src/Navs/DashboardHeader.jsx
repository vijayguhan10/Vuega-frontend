import { Search, Bell, ChevronDown, User, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/companies": "Companies",
  "/bus-approvals": "Bus Approvals",
  "/analytics": "Analytics",
};

const DashboardHeader = ({ onMenuClick }) => {
  const location = useLocation();
  const currentTitle = pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="flex items-center justify-between px-6 py-3 w-full bg-white border-b border-slate-200 shrink-0">
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 sm:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">{currentTitle}</h1>
          <p className="text-xs text-slate-400 hidden sm:block">
            Super Admin Panel
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex relative max-w-sm w-full mx-6">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search companies, buses..."
          className="w-full py-2 pl-10 pr-4 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg placeholder-slate-400 focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 focus:bg-white outline-none transition-all"
        />
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-500 rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <button className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-semibold text-slate-700">Admin</span>
            <span className="text-[11px] text-slate-400 leading-tight">
              Super Admin
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;