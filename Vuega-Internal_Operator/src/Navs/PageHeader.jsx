import { memo } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { getStoredUser } from '../utils/authStorage';

function PageHeader({ title, subtitle, rightAction }) {
  const user = getStoredUser();

  return (
    <header className="hidden md:block sticky top-0 bg-white z-30 border-b border-gray-200 px-5 py-3 md:px-6 md:py-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base md:text-lg font-bold text-gray-900 leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-[11px] md:text-xs text-gray-400 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {rightAction && <div>{rightAction}</div>}

          <button className="relative text-gray-400 hover:text-gray-600 transition-colors">
            <FaBell className="text-base" />
          </button>

          <div className="flex items-center gap-2.5 pl-4 border-l border-gray-200">
            <FaUserCircle className="text-xl text-gray-400" />
            <div className="hidden sm:block">
              <p className="text-[13px] font-semibold text-gray-800 leading-tight">
                {user?.driverName || 'Driver'}
              </p>
              <p className="text-[10px] text-gray-400 leading-tight">
                {user?.type || 'Bus Crew'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default memo(PageHeader);
