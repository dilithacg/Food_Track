import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { signOut } from "firebase/auth"; // Import signOut
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  orderBy,
  getDoc,
} from "firebase/firestore";
import {
  ChefHat,
  Clock,
  CheckCircle,
  Package,
  User,
  Loader2,
  TrendingUp,
  LogOut, // Import Logout icon
} from "lucide-react";

export default function ShopDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Recent");
  const [stats, setStats] = useState({ pending: 0, completed: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "food_processing_orders"),
        where("shopId", "==", auth.currentUser.uid),
        orderBy("createdAt", "desc"),
      );

      const querySnapshot = await getDocs(q);

      const ordersData = querySnapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
        };
      });

      const uniqueUserIds = [...new Set(ordersData.map((o) => o.userId))];
      const userNamesMap = {};

      await Promise.all(
        uniqueUserIds.map(async (uid) => {
          if (uid) {
            try {
              const userDoc = await getDoc(doc(db, "users", uid));
              userNamesMap[uid] = userDoc.exists()
                ? userDoc.data().fullName
                : "Customer";
            } catch (err) {
              userNamesMap[uid] = "Customer";
            }
          }
        }),
      );

      const finalOrders = ordersData.map((o) => ({
        ...o,
        customerName: userNamesMap[o.userId] || "Guest User",
      }));

      setOrders(finalOrders);

      const pending = finalOrders.filter((o) => o.status === "Pending").length;
      const completed = finalOrders.filter(
        (o) => o.status === "Completed",
      ).length;
      setStats({ pending, completed });
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Adjust this path to your login route
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const markAsCompleted = async (orderId) => {
    try {
      const orderRef = doc(db, "food_processing_orders", orderId);
      await updateDoc(orderRef, { status: "Completed" });

      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: "Completed" } : o)),
      );
      setStats((prev) => ({
        ...prev,
        pending: prev.pending - 1,
        completed: prev.completed + 1,
      }));
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const filteredOrders = orders.filter((o) =>
    filter === "Recent" ? o.status === "Pending" : o.status === "Completed",
  );

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-4xl font-black text-gray-900 flex items-center gap-3">
                <ChefHat className="text-orange-500" size={36} /> Shop Portal
              </h1>
              <p className="text-gray-500 font-bold mt-1 uppercase tracking-tighter">
                Live Processing Queue
              </p>
            </div>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all font-black text-xs uppercase tracking-widest shadow-sm"
            >
              Logout
              <LogOut
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>

          <div className="flex gap-4">
            <div className="bg-white p-4 px-6 rounded-3xl shadow-sm border-b-4 border-orange-400 text-center min-w-[100px]">
              <p className="text-[10px] font-black text-gray-400 uppercase">
                Active
              </p>
              <p className="text-2xl font-black text-gray-800">
                {stats.pending}
              </p>
            </div>
            <div className="bg-white p-4 px-6 rounded-3xl shadow-sm border-b-4 border-green-400 text-center min-w-[100px]">
              <p className="text-[10px] font-black text-gray-400 uppercase">
                Done
              </p>
              <p className="text-2xl font-black text-gray-800">
                {stats.completed}
              </p>
            </div>
          </div>
        </div>

        {/* Filter Selection */}
        <div className="flex bg-gray-200 p-1 rounded-2xl mb-8 w-fit shadow-inner">
          {["Recent", "Completed"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase transition-all ${
                filter === type
                  ? "bg-white text-gray-900 shadow-sm scale-105"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {type === "Recent" ? "Recent Orders" : "Completed"}
            </button>
          ))}
        </div>

        {/* Orders Grid */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
            <Package className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-bold italic">
              No {filter.toLowerCase()} orders found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className={`bg-white rounded-[2.5rem] p-7 shadow-xl border-t-[12px] transition-all flex flex-col justify-between ${
                  order.status === "Completed"
                    ? "border-green-400 opacity-90"
                    : "border-orange-500"
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-600"
                          : "bg-orange-100 text-orange-600"
                      }`}
                    >
                      {order.status}
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      {order.createdAt.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="bg-gray-900 p-2.5 rounded-xl text-white">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1">
                        Customer
                      </p>
                      <p className="text-sm font-black text-gray-800">
                        {order.customerName}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase mb-1">
                        Target Dish
                      </p>
                      <h3 className="text-2xl font-black text-gray-800 leading-tight">
                        {order.targetFood}
                      </h3>
                    </div>

                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                      <p className="text-[10px] font-black text-orange-500 uppercase mb-2 flex items-center gap-1">
                        <TrendingUp size={12} /> Leftovers to use:
                      </p>
                      <p className="font-bold text-sm text-gray-700 italic">
                        "{order.leftoverItems}"
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase">
                      Payment
                    </p>
                    <p className="text-xl font-black text-gray-900">
                      LKR {order.finalPrice}
                    </p>
                  </div>

                  {order.status !== "Completed" && (
                    <button
                      onClick={() => markAsCompleted(order.id)}
                      className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 transition-all flex items-center gap-2 group shadow-lg shadow-gray-200"
                    >
                      Complete{" "}
                      <CheckCircle
                        size={16}
                        className="group-hover:scale-125 transition-transform"
                      />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
