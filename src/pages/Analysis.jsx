import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import {
  TrendingUp,
  Leaf,
  Wallet,
  ArrowUpRight,
  BarChart3,
  PieChart,
  ShoppingBag,
  Info,
} from "lucide-react";

export default function Analysis() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!auth.currentUser) return;
      try {
        const q = query(
          collection(db, "food_processing_orders"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc"),
        );
        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
        }));
        setOrders(data);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filter logic for current month vs all time
  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    const now = new Date();
    return (
      order.createdAt?.getMonth() === now.getMonth() &&
      order.createdAt?.getFullYear() === now.getFullYear()
    );
  });

  // CALCULATIONS
  // Total Saved = The discounts users got by using Gems
  const totalMoneySaved = filteredOrders.reduce(
    (acc, curr) => acc + (Number(curr.gemDiscountUsed) || 0),
    0,
  );

  // Total Items = Counting the items in the comma separated string
  const totalItemsRecycled = filteredOrders.reduce((acc, curr) => {
    const count = curr.leftoverItems ? curr.leftoverItems.split(",").length : 0;
    return acc + count;
  }, 0);

  const totalSpent = filteredOrders.reduce(
    (acc, curr) => acc + (Number(curr.finalPrice) || 0),
    0,
  );

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="font-black text-gray-400 uppercase tracking-widest text-xs">
            Analyzing Impact...
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8F9FD] p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              Impact Dashboard
            </h1>
            <p className="text-gray-500 font-medium">
              Tracking your savings and environmental contribution.
            </p>
          </div>

          <div className="flex bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            {["All", "This Month"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${
                  filter === t
                    ? "bg-orange-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Card 1: Money Saved */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Wallet size={80} />
            </div>
            <div className="bg-orange-100 w-12 h-12 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <TrendingUp size={24} />
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
              Total Money Saved
            </p>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              <span className="text-lg font-bold text-gray-400 mr-1">LKR</span>
              {totalMoneySaved}
            </h2>
            <p className="text-green-500 text-xs font-black mt-4 flex items-center gap-1">
              <ArrowUpRight size={14} /> Saving through Gems
            </p>
          </div>

          {/* Card 2: Food Recycled */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <Leaf size={80} />
            </div>
            <div className="bg-green-100 w-12 h-12 rounded-2xl flex items-center justify-center text-green-600 mb-6">
              <PieChart size={24} />
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
              Food Items Recycled
            </p>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              {totalItemsRecycled}
              <span className="text-lg font-bold text-gray-400 ml-2">
                Units
              </span>
            </h2>
            <p className="text-gray-400 text-xs font-bold mt-4">
              Direct landfill reduction
            </p>
          </div>

          {/* Card 3: Total Orders */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
              <ShoppingBag size={80} />
            </div>
            <div className="bg-blue-100 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <BarChart3 size={24} />
            </div>
            <p className="text-gray-500 font-bold text-sm uppercase tracking-wider">
              Total Spent
            </p>
            <h2 className="text-4xl font-black text-gray-900 mt-2">
              <span className="text-lg font-bold text-gray-400 mr-1">LKR</span>
              {totalSpent}
            </h2>
            <p className="text-gray-400 text-xs font-bold mt-4">
              Investment in processing
            </p>
          </div>
        </div>

        {/* Bottom Section: Recent Impact History */}
        <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-gray-800">
              Recent Activity
            </h3>
            <div className="text-gray-400 flex items-center gap-2 text-sm font-bold">
              <Info size={16} /> <span>Showing last 10 activities</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead>
                <tr className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em]">
                  <th className="px-6 py-4">Processing Date</th>
                  <th className="px-6 py-4">Processed Item</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Savings</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.slice(0, 10).map((order) => (
                    <tr
                      key={order.id}
                      className="bg-gray-50/50 hover:bg-gray-50 transition-colors group"
                    >
                      <td className="px-6 py-5 rounded-l-[1.5rem] font-bold text-gray-500 text-sm">
                        {order.createdAt?.toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </td>
                      <td className="px-6 py-5">
                        <p className="font-black text-gray-800">
                          {order.targetFood}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          {order.leftoverItems}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            order.status === "Completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-orange-100 text-orange-600"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 rounded-r-[1.5rem] text-right font-black text-green-600">
                        {order.gemDiscountUsed > 0
                          ? `+LKR ${order.gemDiscountUsed}`
                          : "--"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-20 text-gray-400 font-bold italic"
                    >
                      No data found for the selected period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
