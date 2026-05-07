import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Gem,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Settings,
  Bell,
  ArrowLeft,
} from "lucide-react";

export default function Profile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }

    // Real-time listener for user data (especially for gem updates)
    const unsubscribe = onSnapshot(
      doc(db, "users", auth.currentUser.uid),
      (doc) => {
        if (doc.exists()) {
          setUserData(doc.data());
        }
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FD] pb-24">
      <div className="max-w-2xl mx-auto p-6 mt-4">
        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 mb-6 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
            <User size={48} className="text-orange-500" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            {userData?.fullName || "Re-Food User"}
          </h2>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-sm mt-1">
            <Mail size={14} />
            <span>{auth.currentUser?.email}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={12} /> Verified Account
          </div>
        </div>

        {/* Gems Balance Card */}
        <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden mb-8 shadow-xl shadow-blue-100">
          <div className="absolute -right-4 -top-4 opacity-10">
            <Gem size={150} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500/20 p-2 rounded-xl">
                <Gem size={20} className="text-blue-400" />
              </div>
              <p className="text-blue-300 font-black text-xs uppercase tracking-[0.2em]">
                Available Gems
              </p>
            </div>

            <div className="flex items-end gap-3">
              <h3 className="text-5xl font-black">{userData?.gems || 0}</h3>
              <p className="text-blue-400 font-bold mb-2">RE-GEMS</p>
            </div>

            <p className="text-white/40 text-[10px] mt-6 font-medium leading-relaxed max-w-[200px]">
              Use your gems to get discounts on your next food recycling order.
            </p>
          </div>
        </div>

        {/* Footer Credit */}
        <p className="text-center text-gray-300 font-bold text-[10px] uppercase tracking-widest mt-12">
          Re-Food Ecosystem v1.0.4
        </p>
      </div>
    </div>
  );
}
