import { memo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaBus, FaHome, FaUsers, FaChair, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { clearAuthSession } from '../utils/authStorage';

const navItems = [
  { to: '/', label: 'Dashboard', icon: FaHome },
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
    <aside className="hidden md:flex flex-col w-56 lg:w-60 shrink-0 bg-v-primary-bg border-r border-v-border min-h-dvh sticky top-0 text-v-text">
      <div className="flex items-center gap-3 px-5 py-5">
        <div className="w-9 h-9 bg-v-critical rounded-lg flex items-center justify-center">
          <FaBus className="text-v-primary-bg" />
        </div>
        <div>
          <span className="text-base font-bold leading-none">Vuega</span>
          <p className="text-xs font-normal text-v-text-muted mt-0.5">Bus Personnel</p>
        </div>
      </div>

      <div className="px-5 pt-4 pb-2">
        <span className="text-xs font-semibold text-v-text-muted uppercase tracking-wider">Main Menu</span>
      </div>

      <nav className="flex-1 px-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-v-accent text-v-text'
                  : 'text-v-text-secondary hover:bg-v-secondary hover:text-v-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={isActive ? 'text-v-text' : 'text-v-text-muted'} />
                <span className="text-sm font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-3 py-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-v-critical hover:bg-v-secondary transition-colors w-full"
        >
          <FaSignOutAlt />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default memo(Sidebar);
