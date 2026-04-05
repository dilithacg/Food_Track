import { db } from "../firebase";
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from "firebase/firestore";

export const PantryService = {
  // 1. Real-time Listener for Pantry Items
  // This "subscribes" to the user's pantry so it updates instantly in the UI
  subscribeToPantry: (userId, callback) => {
    const userDoc = doc(db, "users", userId);
    return onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        callback(doc.data().pantry || []);
      }
    });
  },

  // 2. Add an ingredient
  addIngredient: async (userId, item) => {
    const userDoc = doc(db, "users", userId);
    try {
      await updateDoc(userDoc, {
        pantry: arrayUnion(item),
      });
    } catch (error) {
      console.error("Error adding ingredient:", error);
    }
  },

  // 3. Remove an ingredient
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
