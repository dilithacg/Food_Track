import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDw9wEL4J84eDlqkg4lO97Zq7vl7butK48",
  authDomain: "food-track-4a7cd.firebaseapp.com",
  projectId: "food-track-4a7cd",
  storageBucket: "food-track-4a7cd.firebasestorage.app",
  messagingSenderId: "370400905753",
  appId: "1:370400905753:web:2d4a2693d2e235b90c7888",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
