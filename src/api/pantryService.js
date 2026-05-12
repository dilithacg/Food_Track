import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export const PantryService = {
  // 1. General Tags (Existing Logic)
  subscribeToTags: (userId, callback) => {
    if (!userId) return;
    return onSnapshot(doc(db, "users", userId), (doc) => {
      callback(doc.exists() ? doc.data().pantry || [] : []);
    });
  },

  addTag: (userId, item) =>
    updateDoc(doc(db, "users", userId), {
      pantry: arrayUnion(item.toLowerCase()),
    }),

  removeTag: (userId, item) =>
    updateDoc(doc(db, "users", userId), { pantry: arrayRemove(item) }),

  // 2. Smart Expiry Items (New Logic)
  subscribeToSmartItems: (userId, callback) => {
    if (!userId) return;
    const q = query(
      collection(db, "pantry"),
      where("userId", "==", userId),
      orderBy("expiryDate", "asc"),
    );
    return onSnapshot(q, (snapshot) => {
      callback(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
  },
  removeSmartItem: async (itemId) => {
    try {
      const itemRef = doc(db, "pantry", itemId);
      await deleteDoc(itemRef);
      console.log("Item deleted successfully");
    } catch (error) {
      console.error("Error removing smart item:", error);
      throw error;
    }
  },

  deductIngredients: async (userId, recipeIngredients) => {
    try {
      const pantryRef = collection(db, "pantry");

      for (const ing of recipeIngredients) {
        const cleanedName = ing.name.toLowerCase().trim();
        console.log(`🔍 Searching for: "${cleanedName}"`);

        const q = query(
          pantryRef,
          where("userId", "==", userId),
          where("name", "==", cleanedName),
        );

        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          console.log(`❌ No match found for: ${cleanedName}`);
          continue;
        }

        for (const document of querySnapshot.docs) {
          const pantryItem = document.data();
          const currentQty = parseFloat(pantryItem.quantity) || 0;

          const amountString = ing.amount.toString();
          const deductQty = parseFloat(amountString.match(/[\d.]+/)) || 0;

          console.log(
            `✅ Found ${cleanedName}: Current=${currentQty}, Deduct=${deductQty}`,
          );

          if (currentQty > deductQty) {
            await updateDoc(doc(db, "pantry", document.id), {
              quantity: (currentQty - deductQty).toString(),
            });
          } else {
            await deleteDoc(doc(db, "pantry", document.id));
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Error deducting ingredients:", error);
      throw error;
    }
  },
};
