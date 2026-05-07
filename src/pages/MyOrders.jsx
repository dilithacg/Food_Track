import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  MapPin,
  Utensils,
  Loader2,
  Gem,
  Filter,
} from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All"); // State for filtering

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "food_processing_orders"),
      where("userId", "==", auth.currentUser.uid),
      orderBy("createdAt", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Logic to filter orders based on the button clicked
  const filteredOrders = orders.filter((order) => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      <div className="max-w-2xl mx-auto">
        <header className="py-8">
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <ShoppingBag className="text-orange-500" /> My Re-Food Orders
          </h1>
          <p className="text-gray-500 font-bold text-sm uppercase tracking-widest mt-1">
            Track your recycling progress
          </p>
        </header>

        {/* --- Filter Bar --- */}
        <div className="flex gap-2 mb-8 bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
          {["All", "Pending", "Completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`flex-1 py-3 rounded-[1.5rem] font-black text-xs uppercase tracking-tighter transition-all ${
                filter === status
                  ? "bg-orange-500 text-white shadow-md shadow-orange-200 scale-105"
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-12 text-center shadow-sm border-2 border-dashed border-gray-200">
            <Utensils className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold">
              No {filter !== "All" ? filter.toLowerCase() : ""} orders found.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                {/* Status Bar */}
                <div
                  className={`p-4 px-8 flex justify-between items-center ${
                    order.status === "Completed"
                      ? "bg-green-500"
                      : "bg-orange-500"
                  }`}
                >
                  <span className="text-white font-black text-xs uppercase tracking-tighter flex items-center gap-2">
                    {order.status === "Completed" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <Clock size={16} />
                    )}
                    {order.status}
                  </span>
                  <span className="text-white/80 text-[10px] font-bold">
                    {order.createdAt?.toDate().toLocaleDateString()}
                  </span>
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                        Converting into
                      </p>
                      <h2 className="text-2xl font-black text-gray-800 leading-tight">
                        {order.targetFood}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase mb-1">
                        Paid
                      </p>
                      <p className="text-xl font-black text-gray-900">
                        LKR {order.finalPrice}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                    <p className="text-[10px] font-black text-gray-400 uppercase mb-2">
                      Used Items
                    </p>
                    <p className="text-sm font-bold text-gray-600 italic">
                      {order.leftoverItems}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-500">
                      <MapPin size={16} className="text-orange-500" />
                      <span className="text-xs font-bold">
                        Check Shop for Pickup
                      </span>
                    </div>

                    {order.gemDiscountUsed > 0 && (
                      <div className="flex items-center gap-1 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        <Gem size={12} className="text-blue-500" />
                        <span className="text-[10px] font-black text-blue-600 uppercase">
                          Save LKR {order.gemDiscountUsed}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
