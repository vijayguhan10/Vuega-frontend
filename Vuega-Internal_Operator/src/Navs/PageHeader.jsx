import { memo } from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';
import { getStoredUser } from '../utils/authStorage';

function PageHeader({ title, subtitle, rightAction }) {
  const user = getStoredUser();

  return (
    <header className="hidden md:block sticky top-0 bg-v-primary-bg z-30 border-b border-v-border px-5 py-3 md:px-6 md:py-3.5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-v-text leading-tight">{title}</h1>
          {subtitle && (
            <p className="text-sm font-normal text-v-text-secondary mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {rightAction && <div>{rightAction}</div>}

          <button className="relative text-v-text-muted hover:text-v-text-secondary transition-colors">
            <FaBell className="text-lg" />
          </button>

          <div className="flex items-center gap-2.5 pl-4 border-l border-v-border">
            <FaUserCircle className="text-2xl text-v-text-muted" />
            <div className="hidden sm:block">
              <p className="text-base font-semibold text-v-text leading-tight">
                {user?.driverName || 'Driver'}
              </p>
              <p className="text-sm font-normal text-v-text-muted leading-tight">
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
