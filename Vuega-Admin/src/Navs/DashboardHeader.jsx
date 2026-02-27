import { useState, useEffect } from "react";
import { Bell, ChevronDown, User, Menu, Clock } from "lucide-react";

const DashboardHeader = ({ onMenuClick }) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const mins = now.getMinutes();
  const secs = now.getSeconds();
  const h12 = hours % 12 || 12;
  const ampm = hours >= 12 ? "PM" : "AM";
  const pad = (n) => String(n).padStart(2, "0");

  const greeting =
    hours < 12 ? "Good Morning" : hours < 17 ? "Good Afternoon" : "Good Evening";

  const formattedDate = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <header className="flex items-center justify-between px-6 py-3 w-full bg-primary border-b border-border shrink-0">
      {/* Left: Mobile menu + Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1.5 rounded-lg hover:bg-secondary text-text-muted sm:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block">
          <p className="font-semibold text-text">{greeting}, Admin</p>
          <p className="text-[11px] text-text-muted">{formattedDate}</p>
        </div>
      </div>

      {/* Right: Clock + Notifications + Profile */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 bg-[#F5F5F4] border border-border rounded-full px-4 py-1.5">
          <Clock className="w-3.5 h-3.5 text-text-muted" />
          <div className="flex items-baseline gap-0.5 tabular-nums">
            <span className="font-bold text-text tracking-wide">{pad(h12)}</span>
            <span className="font-bold text-text animate-pulse">:</span>
            <span className="font-bold text-text tracking-wide">{pad(mins)}</span>
            <span className="font-bold text-text animate-pulse">:</span>
            <span className="font-bold text-text tracking-wide">{pad(secs)}</span>
            <span className="text-[10px] font-semibold text-text-muted ml-1">{ampm}</span>
          </div>
        </div>

        <div className="h-6 w-px bg-border" />

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
            <span className="font-semibold text-text">Admin</span>
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