import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import {
  UtensilsCrossed,
  Loader2,
  Gem,
  CheckCircle2,
  Plus,
  Check,
  Zap,
  MapPin, // Add MapPin Icon
} from "lucide-react";

export default function UserRequest() {
  const [shops, setShops] = useState([]);
  const [myLeftovers, setMyLeftovers] = useState([]);
  const [userGems, setUserGems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [selectedLeftoverIds, setSelectedLeftoverIds] = useState([]);
  const [useGems, setUseGems] = useState(false);
  const [order, setOrder] = useState({
    targetFood: "",
    shopId: "",
    serviceFee: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.currentUser) {
        setFetching(false);
        return;
      }
      try {
        const shopSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "shop")),
        );
        setShops(shopSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const pantrySnap = await getDocs(
          query(
            collection(db, "pantry"),
            where("userId", "==", auth.currentUser.uid),
          ),
        );
        setMyLeftovers(pantrySnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) setUserGems(userDoc.data()?.gems || 0);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, []);

  const toggleItem = (id) => {
    setSelectedLeftoverIds((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };

  const gemDiscount = userGems >= 50 && useGems ? 50 : 0;
  const finalTotal = Math.max(0, (order.serviceFee || 0) - gemDiscount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!order.shopId || selectedLeftoverIds.length === 0) {
      alert("Please select items and a shop.");
      return;
    }
    setLoading(true);

    try {
      const selectedItems = myLeftovers.filter((i) =>
        selectedLeftoverIds.includes(i.id),
      );
      const itemNames = selectedItems.map((i) => i.name).join(", ");

      await addDoc(collection(db, "food_processing_orders"), {
        targetFood: order.targetFood,
        shopId: order.shopId,
        serviceFee: order.serviceFee,
        leftoverItems: itemNames,
        finalPrice: finalTotal,
        userId: auth.currentUser.uid,
        status: "Pending",
        createdAt: serverTimestamp(),
        gemDiscountUsed: useGems ? 50 : 0,
      });

      const deletePromises = selectedLeftoverIds.map((itemId) =>
        deleteDoc(doc(doc(db, "pantry", itemId))),
      );
      await Promise.all(deletePromises);

      const userRef = doc(db, "users", auth.currentUser.uid);
      let gemChange = selectedLeftoverIds.length * 10 - (useGems ? 50 : 0);
      await updateDoc(userRef, { gems: increment(gemChange) });

      alert("Order success! Pantry cleared and Gems updated.");
      window.location.reload();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
      </div>
    );

  return (
    <div className="max-w-xl mx-auto p-4 py-10">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-b-[10px] border-orange-500">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
              <UtensilsCrossed className="text-orange-500" /> Re-Food
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              Convert your leftovers
            </p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-blue-100">
            <Gem className="text-blue-500" size={18} />
            <span className="font-black text-blue-700">{userGems}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-3 block">
              1. Select Pantry Items
            </label>
            <div className="flex flex-wrap gap-2">
              {myLeftovers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border-2 ${
                    selectedLeftoverIds.includes(item.id)
                      ? "bg-orange-500 border-orange-500 text-white shadow-md"
                      : "bg-gray-50 border-gray-100 text-gray-600 hover:border-orange-200"
                  }`}
                >
                  {selectedLeftoverIds.includes(item.id) ? (
                    <Check size={14} />
                  ) : (
                    <Plus size={14} />
                  )}
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">
                2. Convert to?
              </label>
              <input
                required
                placeholder="e.g. Cutlets"
                className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                value={order.targetFood}
                onChange={(e) =>
                  setOrder({ ...order, targetFood: e.target.value })
                }
              />
            </div>

            {/* 3. Shop & Location Display Updated */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">
                3. Choose Processing Shop
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-orange-200 appearance-none pr-10"
                  onChange={(e) => {
                    const s = shops.find((shop) => shop.id === e.target.value);
                    setOrder({
                      ...order,
                      shopId: e.target.value,
                      serviceFee: s?.serviceFee || 0,
                    });
                  }}
                >
                  <option value="">Select Shop & Location</option>
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ({s.address || s.location || "City Area"})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MapPin size={18} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Gems & Summary Sections... (Same as your code) */}
          {userGems >= 50 ? (
            <button
              type="button"
              onClick={() => setUseGems(!useGems)}
              className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                useGems
                  ? "border-blue-500 bg-blue-50 ring-4 ring-blue-50"
                  : "border-gray-100 bg-white hover:border-blue-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-colors ${useGems ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-400 group-hover:bg-blue-100"}`}
                >
                  <Zap size={20} fill={useGems ? "currentColor" : "none"} />
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-800">Redeem 50 Gems</p>
                  <p className="text-xs text-blue-600 font-bold">
                    - LKR 50.00 Discount
                  </p>
                </div>
              </div>
              <CheckCircle2
                className={useGems ? "text-blue-500" : "text-gray-200"}
              />
            </button>
          ) : (
            <div className="p-4 bg-gray-50 rounded-3xl border border-dashed border-gray-200 flex items-center gap-3 opacity-60">
              <Gem className="text-gray-400" size={18} />
              <p className="text-[11px] font-bold text-gray-500">
                Collect {50 - userGems} more gems to unlock discounts!
              </p>
            </div>
          )}

          <div className="bg-gray-900 p-6 rounded-[2rem] text-white shadow-xl">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold opacity-50 uppercase tracking-widest">
                Total Payable
              </span>
              {useGems && (
                <span className="text-[10px] bg-blue-500 px-2 py-1 rounded-lg font-black uppercase">
                  Gem Applied
                </span>
              )}
            </div>
            <div className="flex justify-between items-end">
              <span className="text-4xl font-black text-orange-400">
                <span className="text-lg mr-1 text-white opacity-40 italic font-normal text-sm">
                  LKR
                </span>
                {finalTotal}
              </span>
              <div className="text-right">
                <p className="text-[10px] font-bold opacity-40 uppercase">
                  Earning
                </p>
                <p className="text-green-400 font-black">
                  +{selectedLeftoverIds.length * 10} Gems
                </p>
              </div>
            </div>
          </div>

          <button
            disabled={loading || selectedLeftoverIds.length === 0}
            className="w-full bg-orange-500 text-white py-6 rounded-[2rem] font-black text-xl shadow-lg shadow-orange-200 hover:bg-orange-600 transition-all active:scale-95 disabled:bg-gray-200"
          >
            {loading ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Place Re-Food Order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
