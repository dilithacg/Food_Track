import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center p-0 md:p-6">
      {/* Container with subtle rounded border for desktop */}
      <div className="flex w-full max-w-4xl bg-[#f8f6f2] rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-150">
        
        {/* Left Side: Visual/Image (Hidden on mobile) */}
        <div className="hidden md:flex md:w-1/2 relative">
          <img 
            src="https://images.unsplash.com/photo-1542223189-67a03fa0f0bd?auto=format&fit=crop&q=80&w=1000" 
            alt="Fresh organic vegetables" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900/20 backdrop-blur-[2px] flex flex-col justify-end p-12">
            <h1 className="text-4xl font-bold text-white drop-shadow-md">Eat Fresh.</h1>
            <p className="text-white/90 mt-2 text-lg">Your journey to zero-waste cooking starts here.</p>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-green-800 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-gray-500 mt-2">
              Please enter your details to sign in.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-600/10 transition-all text-sm"
                required
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none focus:ring-4 focus:ring-green-600/10 transition-all text-sm"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400 hover:text-green-700 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="flex justify-end">
              <span className="text-xs font-medium text-green-700 cursor-pointer hover:underline">Forgot Password?</span>
            </div>

            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl font-bold shadow-lg shadow-green-900/20 active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#f8f6f2] px-2 text-gray-400">Or continue with</span></div>
          </div>

          <button className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3.5 rounded-2xl hover:bg-white hover:border-green-200 hover:shadow-sm transition-all group">
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5 group-hover:scale-110 transition-transform"
            />
            <span className="text-sm font-semibold text-gray-700">Google Account</span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-10">
            New to the community?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-700 font-bold hover:text-green-800 transition-colors"
            >
              Join for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}