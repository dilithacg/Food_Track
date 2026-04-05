import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const googleProvider = new GoogleAuthProvider();

export const AuthService = {
  // 1. Register with Email & Password
  register: async (email, password, fullName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Update Firebase Profile with Full Name
      await updateProfile(user, { displayName: fullName });

      // Create a User Document in Firestore to store pantry/stats
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName,
        email,
        createdAt: new Date(),
        pantry: [],
        savedRecipes: [],
      });

      return user;
    } catch (error) {
      throw error.message;
    }
  },

  // 2. Login with Email & Password
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      return userCredential.user;
    } catch (error) {
      throw error.message;
    }
  },

  // 3. Google Social Login
  loginWithGoogle: async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Ensure user document exists in Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          lastLogin: new Date(),
        },
        { merge: true },
      );

      return user;
    } catch (error) {
      throw error.message;
    }
  },

  // 4. Logout
  logout: async () => {
    await signOut(auth);
  },
};
