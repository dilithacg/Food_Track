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
  MapPin,
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
        // Fetch only users with role 'shop'
        const shopSnap = await getDocs(
          query(collection(db, "users"), where("role", "==", "shop")),
        );
        setShops(shopSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Fetch user's pantry items
        const pantrySnap = await getDocs(
          query(
            collection(db, "pantry"),
            where("userId", "==", auth.currentUser.uid),
          ),
        );
        setMyLeftovers(pantrySnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Get current user gem balance
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
        if (userDoc.exists()) setUserGems(userDoc.data()?.gems || 0);
      } catch (err) {
        console.error("Fetch Error:", err);
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

      // 1. Create the order document
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

      // 2. Delete selected items from pantry (FIXED segment error)
      const deletePromises = selectedLeftoverIds.map((itemId) =>
        deleteDoc(doc(db, "pantry", itemId)),
      );
      await Promise.all(deletePromises);

      // 3. Calculate and update User Gems
      const userRef = doc(db, "users", auth.currentUser.uid);
      // Logic: Gain 10 gems per item, subtract 50 if discount was used
      let gemChange = selectedLeftoverIds.length * 10 - (useGems ? 50 : 0);
      await updateDoc(userRef, { gems: increment(gemChange) });

      alert("Order success! Pantry items recycled and Gems updated.");
      window.location.reload();
    } catch (err) {
      console.error("Submit Error:", err);
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
    <div className="max-w-xl mx-auto p-4 py-10 pb-24">
      <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border-b-[10px] border-orange-500">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-800 flex items-center gap-2">
              <UtensilsCrossed className="text-orange-500" /> Re-Food
            </h2>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">
              Sustainable Processing Request
            </p>
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-2xl flex items-center gap-2 border border-blue-100 shadow-sm">
            <Gem className="text-blue-500" size={18} />
            <span className="font-black text-blue-700">{userGems}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Pantry Items */}
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-3 block">
              1. Select Pantry Items to Recycle
            </label>
            <div className="flex flex-wrap gap-2">
              {myLeftovers.length > 0 ? (
                myLeftovers.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className={`px-4 py-3 rounded-2xl font-bold text-sm transition-all flex items-center gap-2 border-2 ${
                      selectedLeftoverIds.includes(item.id)
                        ? "bg-orange-500 border-orange-500 text-white shadow-md"
                        : "bg-gray-50 border-gray-100 text-gray-600 hover:border-orange-200 shadow-sm"
                    }`}
                  >
                    {selectedLeftoverIds.includes(item.id) ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      <Plus size={14} strokeWidth={3} />
                    )}
                    {item.name}
                  </button>
                ))
              ) : (
                <p className="text-xs font-bold text-gray-400 italic p-2 italic">
                  Your pantry is empty.
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {/* Section 2: Target Food */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">
                2. Target Dish (What should they cook?)
              </label>
              <input
                required
                placeholder="e.g. Fried Rice, Vegetable Cutlets"
                className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-200 transition-all shadow-inner"
                value={order.targetFood}
                onChange={(e) =>
                  setOrder({ ...order, targetFood: e.target.value })
                }
              />
            </div>

            {/* Section 3: Shop Selection */}
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase ml-2 mb-2 block">
                3. Choose Processing Shop
              </label>
              <div className="relative">
                <select
                  required
                  className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-orange-200 appearance-none pr-12 shadow-inner cursor-pointer"
                  onChange={(e) => {
                    const s = shops.find((shop) => shop.id === e.target.value);
                    setOrder({
                      ...order,
                      shopId: e.target.value,
                      serviceFee: s?.serviceFee || 0,
                    });
                  }}
                >
                  <option value="">Select a Chef or Kitchen</option>
                  {shops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} — ({s.address || s.location || "Available"})
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <MapPin size={18} className="text-orange-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Gem Redemption */}
          {userGems >= 50 ? (
            <button
              type="button"
              onClick={() => setUseGems(!useGems)}
              className={`w-full p-5 rounded-3xl border-2 transition-all flex items-center justify-between group ${
                useGems
                  ? "border-blue-500 bg-blue-50 ring-4 ring-blue-50"
                  : "border-gray-100 bg-white hover:border-blue-200 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-2xl transition-colors ${
                    useGems
                      ? "bg-blue-500 text-white shadow-lg shadow-blue-200"
                      : "bg-gray-100 text-gray-400 group-hover:bg-blue-100"
                  }`}
                >
                  <Zap size={20} fill={useGems ? "currentColor" : "none"} />
                </div>
                <div className="text-left">
                  <p className="font-black text-gray-800">Redeem 50 Gems</p>
                  <p className="text-[10px] text-blue-600 font-black uppercase">
                    - LKR 50.00 Instant Discount
                  </p>
                </div>
              </div>
              <CheckCircle2
                className={useGems ? "text-blue-500" : "text-gray-200"}
                size={24}
              />
            </button>
          ) : (
            <div className="p-5 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex items-center gap-3 opacity-70">
              <div className="bg-gray-200 p-2 rounded-xl">
                <Gem className="text-gray-400" size={16} />
              </div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter leading-tight">
                Unlock Gem Discounts at 50 Gems. <br />
                <span className="text-orange-400">
                  Current Progress: {userGems}/50
                </span>
              </p>
            </div>
          )}

          {/* Section 5: Order Summary Card */}
          <div className="bg-gray-900 p-7 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>

            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em]">
                Processing Total
              </span>
              {useGems && (
                <span className="text-[9px] bg-blue-500 text-white px-2 py-1 rounded-lg font-black uppercase tracking-tighter">
                  Discount Applied
                </span>
              )}
            </div>

            <div className="flex justify-between items-end relative z-10">
              <span className="text-5xl font-black text-white">
                <span className="text-sm mr-2 opacity-30 font-bold italic">
                  LKR
                </span>
                {finalTotal}
              </span>
              <div className="text-right">
                <p className="text-[9px] font-black opacity-30 uppercase mb-1">
                  Gem Reward
                </p>
                <p className="text-green-400 font-black text-lg">
                  +{selectedLeftoverIds.length * 10}
                  <span className="text-[10px] ml-1 uppercase">Gems</span>
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            disabled={loading || selectedLeftoverIds.length === 0}
            className="w-full bg-orange-500 text-white py-6 rounded-[2.2rem] font-black text-xl shadow-xl shadow-orange-200 hover:bg-orange-600 hover:-translate-y-1 active:translate-y-0 transition-all disabled:bg-gray-200 disabled:shadow-none disabled:translate-y-0 uppercase tracking-widest"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="animate-spin" /> Processing...
              </div>
            ) : (
              "Place Re-Food Order"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
