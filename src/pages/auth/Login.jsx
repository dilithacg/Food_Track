import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../api/authService";
// 1. Import Firestore functions and your db config
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // 2. Capture the user object from the login service
      const user = await AuthService.login(email, password);

      // 3. Check the user's role in Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        navigate("/admin"); // Redirect Admins here
      } else {
        navigate("/home"); // Redirect regular users here
      }
    } catch (err) {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await AuthService.loginWithGoogle();

      // 4. Same check for Google Login
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (userDoc.exists() && userDoc.data().role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center p-0 md:p-6">
      <div className="flex w-full max-w-4xl bg-[#f8f6f2] rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden min-h-150">
        {/* Left Side Visual */}
        <div className="hidden md:flex md:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1542223189-67a03fa0f0bd?auto=format&fit=crop&q=80&w=1000"
            className="absolute inset-0 w-full h-full object-cover"
            alt="visual"
          />
          <div className="absolute inset-0 bg-green-900/20 backdrop-blur-[2px] flex flex-col justify-end p-12 text-white">
            <h1 className="text-4xl font-bold">Eat Fresh.</h1>
            <p className="mt-2 text-lg">
              Your journey to zero-waste cooking starts here.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mb-8">
            Please enter your details to sign in.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm border border-red-100">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative group">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors"
                size={20}
              />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none transition-all text-sm"
                required
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600 transition-colors"
                size={20}
              />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#efeae2] border border-transparent focus:bg-white focus:border-green-600 focus:outline-none transition-all text-sm"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400 hover:text-green-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f8f6f2] px-2 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 py-3.5 rounded-2xl hover:bg-white transition-all group"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              className="w-5 h-5"
              alt="google"
            />
            <span className="text-sm font-semibold text-gray-700">
              Google Account
            </span>
          </button>

          <p className="text-center text-sm text-gray-500 mt-10">
            New?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-700 font-bold hover:underline"
            >
              Join for free
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
