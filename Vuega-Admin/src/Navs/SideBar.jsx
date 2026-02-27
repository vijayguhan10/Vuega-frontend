import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Building2,
  Bus,
  Route,
  BarChart3,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { name: "Companies", icon: Building2, path: "/companies" },
  { name: "Bus Approvals", icon: Bus, path: "/bus-approvals" },
  { name: "Route Approvals", icon: Route, path: "/route-approvals" },
  { name: "Analytics", icon: BarChart3, path: "/analytics" },
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
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 sm:hidden" onClick={onClose} />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-primary border-r border-border transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"
          } sm:translate-x-0`}
      >
        <div className="flex flex-col h-full px-4 py-5">
          {/* Logo + Mobile close */}
          <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-3">
              <div className="bg-accent p-2 rounded-xl">
                <Bus className="w-5 h-5 text-text" />
              </div>
              <div>
                <h1 className="text-lg text-text">Vuega</h1>
                <p className="text-[11px] text-text-muted leading-tight">
                  Super Admin
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-secondary text-text-muted sm:hidden"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Label */}
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider px-3 mb-2">
            Main Menu
          </p>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1">
            {menuItems.map(({ name, icon: Icon, path }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-accent/30 text-text shadow-sm"
                    : "text-text-muted hover:bg-secondary hover:text-text"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={20}
                      className={isActive ? "text-text" : "text-text-muted"}
                      strokeWidth={isActive ? 2.2 : 1.8}
                    />
                    <span>{name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 text-alert hover:bg-alert/10 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default SideBar;