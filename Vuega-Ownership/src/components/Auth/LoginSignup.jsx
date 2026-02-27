
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaCog, FaShieldAlt, FaArrowRight } from "react-icons/fa";

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
 // TODO: Replace with actual API call to Spring Boot backend
 // const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
 // email: formData.email,
 // password: formData.password,
 // role: "technical_operator"
 // });
 // localStorage.setItem("token", response.data.token);
 // localStorage.setItem("user", JSON.stringify(response.data.user));

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
 <div className="flex min-h-screen bg-v-primary-bg">
 {/* Left Side - Branding */}
 <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-v-brand-dark via-v-brand-darker to-v-brand-dark relative overflow-hidden">
 {/* Background pattern */}
 <div className="absolute inset-0 opacity-5">
 <div className="absolute top-20 left-20 w-72 h-72 border border-white/20 rounded-full" />
 <div className="absolute bottom-32 right-16 w-96 h-96 border border-white/10 rounded-full" />
 <div className="absolute top-1/2 left-1/3 w-48 h-48 border border-white/15 rounded-full" />
 </div>

 <div className="relative z-10 flex flex-col justify-between p-12 w-full">
 {/* Logo */}
 <div className="flex items-center gap-3">
 <div className="bg-v-accent p-2.5 rounded-xl">
 <FaCog className="w-6 h-6 text-v-text" />
 </div>
 <div>
 <h1 className="text-white font-bold">Vuega</h1>
 <p className="text-gray-400 ">Bus Company Owner Portal</p>
 </div>
 </div>

 {/* Center content */}
 <div className="flex flex-col gap-6">
 <h2 className=" font-bold text-white leading-tight">
 Configure &<br />
 Operate Your Fleet<br />
 <span className="text-v-accent">With Precision</span>
 </h2>
 <p className="text-gray-400 max-w-md">
 Design seat layouts, schedule trips, assign drivers, configure
 pricing, and manage bus maintenance — all from one dashboard.
 </p>
 <div className="flex flex-col gap-3 mt-4">
 <div className="flex items-center gap-3 text-gray-300 ">
 <FaShieldAlt className="w-4 h-4 text-v-accent shrink-0" />
 <span>Seat layout design and bus configuration</span>
 </div>
 <div className="flex items-center gap-3 text-gray-300 ">
 <FaShieldAlt className="w-4 h-4 text-v-accent shrink-0" />
 <span>Trip scheduling with driver assignment</span>
 </div>
 <div className="flex items-center gap-3 text-gray-300 ">
 <FaShieldAlt className="w-4 h-4 text-v-accent shrink-0" />
 <span>Per-trip pricing and maintenance tracking</span>
 </div>
 </div>
 </div>

 {/* Footer */}
 <p className="text-gray-500 ">
 &copy; {new Date().getFullYear()} Vuega Technologies. All rights reserved.
 </p>
 </div>
 </div>

 {/* Right Side - Login Form */}
 <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
 <div className="w-full max-w-md">
 {/* Mobile logo */}
 <div className="flex items-center gap-3 mb-10 lg:hidden">
 <div className="bg-v-accent p-2.5 rounded-xl">
 <FaCog className="w-6 h-6 text-v-text" />
 </div>
 <div>
 <h1 className="text-v-text font-bold">Vuega</h1>
 <p className="text-v-text-muted ">Bus Company Owner Portal</p>
 </div>
 </div>

 <div className="mb-8">
 <h2 className=" font-bold text-v-text">Welcome back</h2>
 <p className="text-v-text-muted mt-1">
 Sign in to your Bus Company Owner account
 </p>
 </div>

 <form onSubmit={handleSubmit} className="space-y-5">
 {error && (
 <div className="bg-v-critical-light border border-v-critical-border text-v-critical px-4 py-3 rounded-lg">
 {error}
 </div>
 )}

 <div className="flex flex-col gap-1.5">
 <label className=" font-medium text-v-text-secondary">
 Email address
 </label>
 <input
 type="email"
 name="email"
 placeholder="operator@company.com"
 className="w-full px-4 py-3 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent/50 focus:border-v-accent-border transition-all"
 value={formData.email}
 onChange={handleChange}
 />
 </div>

 <div className="flex flex-col gap-1.5">
 <div className="flex items-center justify-between">
 <label className=" font-medium text-v-text-secondary">
 Password
 </label>
 <button
 type="button"
 className=" text-v-text-muted hover:text-v-text font-medium transition-colors"
 >
 Forgot password?
 </button>
 </div>
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 name="password"
 placeholder="Enter your password"
 className="w-full px-4 py-3 pr-11 rounded-lg border border-v-border bg-v-primary-bg text-v-text placeholder-v-text-placeholder focus:outline-none focus:ring-2 focus:ring-v-accent/50 focus:border-v-accent-border transition-all"
 value={formData.password}
 onChange={handleChange}
 />
 <button
 type="button"
 className="absolute right-3 top-1/2 -translate-y-1/2 text-v-text-muted hover:text-v-text-secondary"
 onClick={() => setShowPassword(!showPassword)}
 >
 {showPassword ? (
 <FaEyeSlash className="w-5 h-5" />
 ) : (
 <FaEye className="w-5 h-5" />
 )}
 </button>
 </div>
 </div>

 <button
 type="submit"
 disabled={isLoading}
 className="w-full bg-v-accent hover:bg-v-accent-hover text-v-text py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
 >
 {isLoading ? (
 <div className="w-5 h-5 border-2 border-v-text/30 border-t-v-text rounded-full animate-spin" />
 ) : (
 <>
 Sign In
 <FaArrowRight className="w-4 h-4" />
 </>
 )}
 </button>
 </form>

 <p className="text-center text-v-text-muted mt-8">
 Protected by role-based access control
 </p>
 </div>
 </div>
 </div>
 );
}

export default LoginSignup;
