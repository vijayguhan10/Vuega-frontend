import { memo } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../../Navs/Sidebar';
import BottomNav from '../../Navs/BottomNav';

/**
 * Main app layout with sidebar on md+ and bottom nav on mobile.
 */
function AppLayout() {
  return (
    <div className="flex min-h-dvh bg-white">
      {/* Sidebar — visible on md+ */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 bg-gray-50/50">
        <main className="flex-1 pb-20 md:pb-0 w-full">
          <Outlet />
        </main>
      </div>

      {/* Bottom nav — visible on mobile only */}
      <BottomNav />
    </div>
  );
}

export default memo(AppLayout);
