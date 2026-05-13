import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Home as HomeIcon,
  Search,
  Heart,
  User,
  LogOut,
  Utensils,
  ChevronRight,
  Info,
  ShoppingBag,
  ListOrderedIcon,
  ChartBar,
  Scan,
  LucideListOrdered,
  ShoppingCart,
} from "lucide-react";
import { AuthService } from "../api/authService";

const NavItem = ({ icon, label, to, active }) => (
  <Link to={to} className="w-full">
    <button
      className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold w-full ${
        active
          ? "bg-green-600 text-white shadow-xl shadow-green-100"
          : "text-gray-400 hover:bg-green-50 hover:text-green-700"
      }`}
    >
      {icon}
      <span className="text-sm tracking-wide">{label}</span>
    </button>
  </Link>
);

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  // THE LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await AuthService.logout();
      // Redirect to login page after successful logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* 1. SIDEBAR TRIGGER AREA */}
      <div className="fixed left-0 top-0 h-full w-4 z-60 peer" />

      {/* 2. SLIDING NAVBAR */}
      <nav
        className="fixed left-0 top-0 h-screen w-72 bg-white border-r border-gray-100 p-8 
                      flex flex-col justify-between z-70 transition-all duration-500 ease-in-out
                      -translate-x-full peer-hover:translate-x-0 hover:translate-x-0 shadow-2xl"
      >
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-green-600 p-1.5 rounded-full text-white shadow-lg cursor-pointer transition-transform hover:scale-110">
          <ChevronRight size={16} />
        </div>

        <div className="space-y-10">
          <div className="flex items-center gap-3 text-green-700 font-black text-2xl tracking-tight">
            <div className="bg-green-100 p-2 rounded-xl">
              <Utensils size={24} />
            </div>
            <span>FoodTrack</span>
          </div>

          <div className="flex flex-col gap-3">
            {/* Updated 'to' path to /home to match your routing */}
            <NavItem
              icon={<HomeIcon size={22} />}
              label="Home"
              to="/home"
              active={location.pathname === "/home"}
            />
            <NavItem
              icon={<ChartBar size={22} />}
              label="Analysis"
              to="/analysis"
              active={location.pathname === "/analysis"}
            />
            <NavItem
              icon={<ListOrderedIcon size={22} />}
              label="Recipe List"
              to="/all-recipes"
              active={location.pathname === "/all-recipes"}
            />
            <NavItem
              icon={<Scan size={22} />}
              label="Food Scanner"
              to="/food-scanner"
              active={location.pathname === "/food-scanner"}
            />
            <NavItem
              icon={<ShoppingCart size={22} />}
              label="My Orders"
              to="/my-orders"
              active={location.pathname === "/my-orders"}
            />
            <NavItem
              icon={<ShoppingBag size={22} />}
              label="Request Process"
              to="/request-process"
              active={location.pathname === "/request-process"}
            />
            <NavItem
              icon={<User size={22} />}
              label="Profile"
              to="/profile"
              active={location.pathname === "/profile"}
            />
            <NavItem
              icon={<User size={22} />}
              label="Smart Recipe"
              to="/smart-recipe"
              active={location.pathname === "/smart-recipe"}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-50">
          {/* ATTACHED THE LOGOUT HANDLER HERE */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-gray-400 hover:text-red-500 transition-all font-bold w-full px-4 py-3 rounded-xl hover:bg-red-50"
          >
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* 3. BACKGROUND OVERLAY */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-[2px] z-55 pointer-events-none opacity-0 
                      peer-hover:opacity-100 hover:opacity-100 transition-opacity duration-500"
      />
    </>
  );
}
