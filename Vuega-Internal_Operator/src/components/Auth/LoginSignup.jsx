
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Bus, Shield, ArrowRight } from "lucide-react";

function LoginSignup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      // const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      //   email: formData.email,
      //   password: formData.password,
      //   role: "super_admin"
      // });
      // localStorage.setItem("token", response.data.token);

      // Simulate login for now
      await new Promise((resolve) => setTimeout(resolve, 800));
      localStorage.setItem("token", "demo-token");
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err?.response?.data?.message || "Invalid credentials. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 border border-white/20 rounded-full" />
          <div className="absolute bottom-32 right-16 w-96 h-96 border border-white/10 rounded-full" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/15 rounded-full" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">Vuega</h1>
              <p className="text-slate-400 text-xs">Bus Operations Platform</p>
            </div>
          </div>

          {/* Center content */}
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-bold text-white leading-tight">
              Manage Your<br />
              Fleet Operations<br />
              <span className="text-blue-400">With Confidence</span>
            </h2>
            <p className="text-slate-400 text-base max-w-md">
              The unified platform for bus companies to manage trips, routes,
              bookings, and operations — all in one place.
            </p>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Role-based access control for every team member</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Multi-tenant data isolation per company</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300 text-sm">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Real-time trip monitoring and analytics</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} Vuega Technologies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="bg-blue-600 p-2.5 rounded-xl">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-slate-900 text-xl font-bold">Vuega</h1>
              <p className="text-slate-400 text-xs">Bus Operations Platform</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to your Super Admin account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@company.com"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-11 rounded-lg border border-slate-300 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-8">
            Protected by role-based access control
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
