import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  query,
  limit,
} from "firebase/firestore";

const COLLECTION_NAME = "recipes";

export const RecipeService = {
  // 1. Fetch all recipes for the Home grid
  getAllRecipes: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      return querySnapshot.docs.map((doc) => ({
        id: doc.id, // Firebase auto-generated ID
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching recipes:", error);
      throw error;
    }
  },

  // 2. The "One-Click" Seeder
  // Call this once to upload your RECIPES array to Firestore
  seedDatabase: async (recipeArray) => {
    try {
      const recipeRef = collection(db, COLLECTION_NAME);

      // We map through your array and push each one to the King's cloud
      const uploadPromises = recipeArray.map((recipe) => {
        // We remove the local 'id: 1, 2, etc' so Firebase can create its own unique IDs
        const { id, ...recipeData } = recipe;
        return addDoc(recipeRef, recipeData);
      });

      await Promise.all(uploadPromises);
      alert("Success! Your Sri Lankan recipes are now live in the cloud! 🚀");
    } catch (error) {
      console.error("Seeding failed:", error);
      alert("Error seeding database. Check your Firebase console.");
    }
  },
};
