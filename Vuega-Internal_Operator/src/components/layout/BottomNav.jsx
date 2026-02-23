import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaChair, FaUserCircle } from 'react-icons/fa';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/passengers', label: 'Passengers', icon: FaUsers },
  { to: '/seat-map', label: 'Seats', icon: FaChair },
  { to: '/profile', label: 'Profile', icon: FaUserCircle },
];

/**
 * Fixed bottom navigation bar for mobile-first navigation.
 */
function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 safe-bottom md:hidden">
      <div className="max-w-lg sm:max-w-xl mx-auto flex justify-around items-center h-14">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-[#960000]'
                  : 'text-gray-400 active:text-gray-600'
              }`
            }
          >
            <Icon className="text-base leading-none" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

export default memo(BottomNav);
