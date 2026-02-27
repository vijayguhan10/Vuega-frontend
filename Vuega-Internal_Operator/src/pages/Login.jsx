import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBus, FaIdCard, FaLock, FaSignInAlt, FaRoute, FaUsers, FaShieldAlt } from 'react-icons/fa';
import { setAuthSession } from '../utils/authStorage';

export default function Login() {
  const [busNumber, setBusNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmedBusNumber = busNumber.trim();
      const trimmedPassword = password.trim();

      if (!trimmedBusNumber || !trimmedPassword) {
        setError('Bus number and password are required.');
        return;
      }

      setLoading(true);
      setError('');

      setAuthSession(trimmedBusNumber, trimmedPassword);
      setLoading(false);
      navigate('/', { replace: true });
    },
    [busNumber, password, navigate]
  );

  return (
    <div className="min-h-dvh flex flex-col lg:flex-row">
      {/* ───── Left Panel — Brand / Hero ───── */}
      <div className="relative hidden lg:flex lg:w-[48%] xl:w-[45%] flex-col justify-between overflow-hidden bg-[#960000]">

        {/* Top — Logo */}
        <div className="relative z-10 px-10 xl:px-14 pt-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
              <FaBus className="text-white text-xl" />
            </div>
          </div>
        </div>

        {/* Center — Headline */}
        <div className="relative z-10 px-10 xl:px-14 flex-1 flex flex-col justify-center -mt-8">
          <h1 className="text-3xl xl:text-4xl font-bold text-white leading-snug tracking-tight">
            Hello<br />Vuega!
            
          </h1>
          <p className="mt-4 text-sm xl:text-base text-white/70 leading-relaxed max-w-sm">
            Manage your bus routes, passengers and seating — all in one streamlined portal built for crew efficiency.
          </p>

          {/* Feature pills */}
          <div className="mt-6 flex flex-wrap gap-2.5">
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-[11px] font-medium px-3.5 py-1.5 rounded-full border border-white/15">
              <FaRoute className="text-[#FFFADF] text-[10px]" />
              Route Tracking
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-[11px] font-medium px-3.5 py-1.5 rounded-full border border-white/15">
              <FaUsers className="text-[#C6EDFF] text-[10px]" />
              Passenger Logs
            </div>
            <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm text-white/80 text-[11px] font-medium px-3.5 py-1.5 rounded-full border border-white/15">
              <FaShieldAlt className="text-[#FFFADF] text-[10px]" />
              Secure Access
            </div>
          </div>
        </div>

        {/* Bottom — Copyright */}
        <div className="relative z-10 px-10 xl:px-14 pb-8">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Vuega. All rights reserved.</p>
        </div>
      </div>

      {/* ───── Right Panel — Login Form ───── */}
      <div className="flex-1 flex flex-col bg-[#FFFFFF]">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-[#960000] px-6 py-5 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
            <FaBus className="text-white text-lg" />
          </div>
          <span className="text-white font-semibold text-base tracking-tight">Vuega</span>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10 lg:py-0">
          <div className="w-full max-w-md">
            {/* Brand name on right side (desktop) */}
            <div className="hidden lg:block mb-2">
              <span className="text-[#960000] font-semibold text-sm tracking-tight">Vuega</span>
            </div>

            {/* Heading */}
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Welcome Back!
            </h2>
            <p className="text-[13px] text-gray-500 mt-1">
              Sign in to access the bus personnel portal.
            </p>

            {/* Error */}
            {error && (
              <div className="mt-5 bg-[#960000]/5 border border-[#960000]/20 rounded-xl px-4 py-3 flex items-center gap-3 animate-in slide-in-from-top-2">
                <span className="text-[#960000] text-sm">⚠</span>
                <p className="text-sm text-[#960000] font-medium flex-1">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="text-[#960000]/60 hover:text-[#960000] text-lg leading-none transition-colors"
                  aria-label="Dismiss"
                >
                  ×
                </button>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              {/* Bus Number */}
              <div>
                <label htmlFor="busNumber" className="block text-[13px] font-medium text-gray-600 mb-1.5">
                  Bus Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaIdCard />
                  </span>
                  <input
                    id="busNumber"
                    type="text"
                    value={busNumber}
                    onChange={(e) => setBusNumber(e.target.value)}
                    placeholder="e.g. KA-01-F-1234"
                    autoComplete="username"
                    className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-200 bg-[#FFFADF]/30 text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#960000]/30 focus:border-[#960000]/40 transition-all"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-[13px] font-medium text-gray-600 mb-1.5">
                  Password / PIN
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    <FaLock />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your PIN"
                    autoComplete="current-password"
                    className="w-full h-12 pl-11 pr-12 rounded-xl border border-gray-200 bg-[#FFFADF]/30 text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#960000]/30 focus:border-[#960000]/40 transition-all"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-semibold transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading || !busNumber.trim() || !password.trim()}
                className="w-full h-[46px] bg-[#960000] hover:bg-[#7a0000] text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-[#960000]/15 hover:shadow-[#960000]/25 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <FaSignInAlt />
                    Login Now
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 mt-6">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-[11px] text-gray-400 font-normal">Authorized Personnel Only</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Footer on mobile */}
            <p className="lg:hidden text-xs text-gray-400 text-center mt-8">
              &copy; {new Date().getFullYear()} Vuega. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}