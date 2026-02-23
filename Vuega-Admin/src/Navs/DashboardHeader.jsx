import { Bell, ChevronDown, User, Menu } from "lucide-react";
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
    <header className="flex items-center justify-between px-6 py-3 w-full bg-primary border-b border-border shrink-0">
      {/* Left: Mobile menu + Page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg hover:bg-secondary text-text-muted sm:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-text">{currentTitle}</h1>
          <p className="text-xs text-text-muted hidden sm:block">
            Super Admin Panel
          </p>
        </div>
      </div>

      {/* Right: Notifications + Profile */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-text-muted rounded-lg hover:bg-secondary transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-alert rounded-full border-2 border-primary" />
        </button>

        <div className="h-6 w-px bg-border" />

        <button className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-accent rounded-full">
            <User className="w-4 h-4 text-text" />
          </div>
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-sm font-semibold text-text">Admin</span>
            <span className="text-[11px] text-text-muted leading-tight">
              Super Admin
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-text-muted hidden sm:block" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;