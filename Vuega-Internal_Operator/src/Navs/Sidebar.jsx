import { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBus, FaTachometerAlt, FaUsers, FaChair, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { clearAuthSession } from '../utils/authStorage';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FaTachometerAlt },
  { to: '/passengers', label: 'Passengers', icon: FaUsers },
  { to: '/seat-map', label: 'Seat Map', icon: FaChair },
  { to: '/profile', label: 'Profile', icon: FaUserCircle },
];

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthSession();
    navigate('/login', { replace: true });
  };

  return (
    <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 bg-white border-r border-gray-200 min-h-dvh sticky top-0">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-9 h-9 bg-[#960000] rounded-lg flex items-center justify-center">
          <FaBus className="text-white text-sm" />
        </div>
        <div>
          <span className="text-base font-bold text-gray-900 leading-none">Vuega</span>
          <p className="text-[10px] text-gray-400 mt-0.5 tracking-">Bus Personnel</p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Main Menu</span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-[#C6EDFF] text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`text-sm ${isActive ? 'text-gray-800' : 'text-gray-400'}`} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-[#960000] hover:bg-[#960000]/5 transition-colors w-full"
        >
          <FaSignOutAlt className="text-sm" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
