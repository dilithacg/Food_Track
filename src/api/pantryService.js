import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

export const PantryService = {
  // Real-time listener: This updates the 'pantry' state automatically
  subscribeToPantry: (userId, callback) => {
    if (!userId) return;
    const userDoc = doc(db, "users", userId);
    return onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        callback(doc.data().pantry || []);
      } else {
        callback([]);
      }
    });
  },

  addIngredient: async (userId, item) => {
    const userDoc = doc(db, "users", userId);
    // Standardize to lowercase for better matching logic
    const formattedItem = item.trim().toLowerCase();
    try {
      await updateDoc(userDoc, {
        pantry: arrayUnion(formattedItem),
      });
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  },

  removeIngredient: async (userId, item) => {
    const userDoc = doc(db, "users", userId);
    try {
      await updateDoc(userDoc, {
        pantry: arrayRemove(item),
      });
    } catch (error) {
      console.error("Error removing ingredient:", error);
    }
  },
};
