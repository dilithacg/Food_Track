import React, { useState } from "react";
import { db, auth } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Store, Mail, Lock, MapPin, Phone, Loader2 } from "lucide-react";

export default function AdminAddShop() {
  const [formData, setFormData] = useState({
    shopName: "",
    email: "",
    password: "",
    address: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddShop = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      // 1. Create the Auth account in Firebase
      // Note: This will log the Admin OUT and the Shop IN.
      // To prevent this in production, you usually use a Firebase Admin SDK (Node.js)
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      );
      const shopUser = userCredential.user;

      // 2. Save shop details to Firestore with 'shop' role
      await setDoc(doc(db, "users", shopUser.uid), {
        uid: shopUser.uid,
        name: formData.shopName,
        email: formData.email,
        address: formData.address,
        phone: formData.phone,
        role: "shop", // <--- CRITICAL: Defines the user type
        createdAt: new Date().toISOString(),
        status: "active",
      });

      setMessage("Shop account created successfully!");
      setFormData({
        shopName: "",
        email: "",
        password: "",
        address: "",
        phone: "",
      });
    } catch (error) {
      console.error("Error adding shop:", error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-orange-100 p-4 rounded-2xl text-orange-600">
          <Store size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-gray-800">
            Register New Shop
          </h2>
          <p className="text-gray-500 font-medium">
            Create a partner account for local vendors
          </p>
        </div>
      </div>

      <form onSubmit={handleAddShop} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
              Shop Name
            </label>
            <div className="relative">
              <Store
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                name="shopName"
                value={formData.shopName}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 border-none font-bold"
                placeholder="e.g. Fresh Mart"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 border-none font-bold"
                placeholder="shop@email.com"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
            Initial Password
          </label>
          <div className="relative">
            <Lock
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              required
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 border-none font-bold"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
            Physical Address
          </label>
          <div className="relative">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              required
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 border-none font-bold"
              placeholder="123 Main St, Colombo"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              required
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-orange-200 border-none font-bold"
              placeholder="+94 77 ..."
            />
          </div>
        </div>

        {message && (
          <p
            className={`p-4 rounded-xl text-center font-bold ${message.includes("success") ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {message}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-800 text-white py-5 rounded-3xl font-black text-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:bg-gray-400 shadow-xl"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Create Shop Account"
          )}
        </button>
      </form>
    </div>
  );
}
