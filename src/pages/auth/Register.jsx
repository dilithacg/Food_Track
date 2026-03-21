import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center p-0 md:p-6">
      {/* Main Container */}
      <div className="flex w-full max-w-4xl bg-[#f8f6f2] rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-175">
        
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-green-800 tracking-tight">
              Create Account
            </h2>
            <p className="text-gray-500 mt-2">
              Join our community of eco-conscious cooks.
            </p>
          </div>

          <form className="space-y-4">
            {/* Full Name */}
            <div className="relative group">
              <User className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-600/10 transition-all text-sm"
              />
            </div>

            {/* Email */}
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-600/10 transition-all text-sm"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-600/10 transition-all text-sm"
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400 hover:text-green-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-600/10 transition-all text-sm"
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400 hover:text-green-700 transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all mt-2"
            >
              Get Started
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#f8f6f2] px-2 text-gray-400">Or sign up with</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3.5 rounded-2xl hover:bg-white hover:border-green-200 hover:shadow-sm transition-all group">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-semibold text-gray-700">Google Account</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-8">
            Already have an account?{" "}
            <Link to="/" className="text-green-700 font-bold hover:text-green-800 transition-colors">
              Log In
            </Link>
          </p>
        </div>

        {/* Right Side: Visual (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&q=80&w=1000" 
            alt="Healthy meal prep" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/10 backdrop-blur-[1px] flex flex-col justify-end p-12">
            <h1 className="text-4xl font-bold text-white drop-shadow-md">Cook Smarter.</h1>
            <p className="text-white/90 mt-2 text-lg">Organize your pantry and discover recipes based on what you have.</p>
          </div>
        </div>
      </div>
    </div>
  );
}