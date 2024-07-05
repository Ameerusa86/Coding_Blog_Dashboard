import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDPN1vBp6yrwRGnasqHRBINSIxXnm0cwYQ",
  authDomain: "coding-blog-622ad.firebaseapp.com",
  projectId: "coding-blog-622ad",
  storageBucket: "coding-blog-622ad.appspot.com",
  messagingSenderId: "546092844491",
  appId: "1:546092844491:web:51456333c3af081575e24e",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;
