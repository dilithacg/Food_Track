import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AuthService } from "../../api/authService";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword)
      return setError("Passwords don't match");

    setLoading(true);
    setError("");
    try {
      await AuthService.register(
        formData.email,
        formData.password,
        formData.fullName,
      );
      navigate("/home");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center p-0 md:p-6">
      <div className="flex w-full max-w-4xl bg-[#f8f6f2] rounded-none md:rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-green-800">Create Account</h2>
          <p className="text-gray-500 mt-2 mb-8">
            Join our eco-conscious community.
          </p>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-6 text-sm flex gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="relative group">
              <User
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600"
                size={20}
              />
              <input
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                type="text"
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#efeae2] focus:bg-white border-none outline-none text-sm"
                required
              />
            </div>

            <div className="relative group">
              <Mail
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600"
                size={20}
              />
              <input
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                type="email"
                placeholder="Email Address"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-[#efeae2] focus:bg-white border-none outline-none text-sm"
                required
              />
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600"
                size={20}
              />
              <input
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#efeae2] focus:bg-white border-none outline-none text-sm"
                required
              />
              <button
                type="button"
                className="absolute right-4 top-3.5 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="relative group">
              <Lock
                className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-green-600"
                size={20}
              />
              <input
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                type="password"
                placeholder="Confirm Password"
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-[#efeae2] focus:bg-white border-none outline-none text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-all mt-4"
            >
              {loading ? "Creating..." : "Get Started"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            Have an account?{" "}
            <Link to="/" className="text-green-700 font-bold">
              Log In
            </Link>
          </p>
        </div>

        {/* Right Side Visual */}
        <div className="hidden md:flex md:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&q=80&w=1000"
            className="absolute inset-0 w-full h-full object-cover"
            alt="meal prep"
          />
          <div className="absolute inset-0 bg-green-900/10 backdrop-blur-[1px] flex flex-col justify-end p-12 text-white">
            <h1 className="text-4xl font-bold">Cook Smarter.</h1>
            <p className="mt-2 text-lg">
              Organize your pantry and discover recipes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
