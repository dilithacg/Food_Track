import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Import your existing app and db
import { db, auth } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
// Import initializeApp to create the secondary instance
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  ArrowLeft,
  Store,
  Mail,
  Lock,
  MapPin,
  BadgeDollarSign,
  Image as ImageIcon,
  UserPlus,
  Info,
} from "lucide-react";

export default function AdminAddShop() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [shop, setShop] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    imageUrl: "",
    serviceFee: "",
    role: "shop",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Get the config from your existing main app instance
      const config = auth.app.options;

      // 2. Create a secondary Firebase app instance using that config
      // This allows us to create a user without logging out the Admin
      const secondaryApp = initializeApp(config, "Secondary");
      const secondaryAuth = getAuth(secondaryApp);

      // 3. Create the Shop Auth Account in the secondary instance
      const userCredential = await createUserWithEmailAndPassword(
        secondaryAuth,
        shop.email,
        shop.password,
      );

      const shopId = userCredential.user.uid;

      // 4. Save Profile to Firestore (using your main 'db')
      await setDoc(doc(db, "users", shopId), {
        uid: shopId,
        name: shop.name,
        email: shop.email,
        address: shop.address,
        imageUrl: shop.imageUrl,
        serviceFee: Number(shop.serviceFee),
        role: "shop",
        description: shop.description,
        createdAt: new Date(),
      });

      // 5. Clean up the secondary instance
      await signOut(secondaryAuth);

      alert("Shop Profile Created! Navigating to Admin Dashboard...");

      // 6. Navigate back - You will still be logged in as Admin!
      navigate("/admin");
    } catch (error) {
      console.error("Creation failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] p-6 md:p-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/admin")}
            className="flex items-center gap-2 text-green-800 font-bold"
          >
            <ArrowLeft size={20} /> Dashboard
          </button>
          <h1 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
            Register Partner
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 mb-2 text-green-800 font-black">
              <Store size={22} /> <span>Shop Branding</span>
            </div>
            <input
              required
              placeholder="Shop Name"
              className="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-xl"
              value={shop.name}
              onChange={(e) => setShop({ ...shop, name: e.target.value })}
            />
            <div className="relative">
              <ImageIcon
                className="absolute left-4 top-4 text-gray-400"
                size={18}
              />
              <input
                placeholder="Shop Image URL"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none font-medium text-sm font-mono text-blue-600"
                value={shop.imageUrl}
                onChange={(e) => setShop({ ...shop, imageUrl: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 mb-2 text-green-800 font-black">
              <MapPin size={22} /> <span>Location & Logistics</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                required
                placeholder="Full Address"
                className="md:col-span-2 p-4 bg-gray-50 rounded-2xl border-none font-bold"
                value={shop.address}
                onChange={(e) => setShop({ ...shop, address: e.target.value })}
              />
              <input
                required
                type="number"
                placeholder="Fee (LKR)"
                className="p-4 bg-gray-50 rounded-2xl border-none font-bold text-orange-600"
                value={shop.serviceFee}
                onChange={(e) =>
                  setShop({ ...shop, serviceFee: e.target.value })
                }
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-4">
            <div className="flex items-center gap-3 mb-2 text-green-800 font-black">
              <Lock size={20} /> <span>Login Access</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="email"
                placeholder="Login Email"
                className="p-4 bg-gray-50 rounded-2xl border-none font-bold"
                value={shop.email}
                onChange={(e) => setShop({ ...shop, email: e.target.value })}
              />
              <input
                required
                type="password"
                placeholder="Access Password"
                className="p-4 bg-gray-50 rounded-2xl border-none font-bold"
                value={shop.password}
                onChange={(e) => setShop({ ...shop, password: e.target.value })}
              />
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100">
            <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
              <Info size={18} className="text-green-800" /> Shop Bio
            </h3>
            <textarea
              placeholder="What makes this shop special?"
              className="w-full p-4 bg-gray-50 rounded-2xl border-none min-h-24 font-medium"
              value={shop.description}
              onChange={(e) =>
                setShop({ ...shop, description: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-800 text-white py-6 rounded-[2.5rem] font-black text-xl shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? (
              "Registering Shop..."
            ) : (
              <>
                <UserPlus size={24} /> Create Shop Account
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
