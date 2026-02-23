import React, { useState } from "react";
import SideBar from "../Navs/SideBar";
import DashboardHeader from "../Navs/DashboardHeader";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area — pushed right by sidebar on desktop */}
      <div className="flex flex-col flex-1 sm:ml-64 min-h-0">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;