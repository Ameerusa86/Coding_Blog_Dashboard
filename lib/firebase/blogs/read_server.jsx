// src/lib/firebase/blogs/read_server.js
import { db } from "@/lib/firebase"; // Adjust the path as per your project structure
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getAllBlogs = async () => {
  return await getDocs(collection(db, "blogs")).then((snaps) =>
    snaps.docs.map((d) => d.data())
  );
};

export const getBlog = async (id) => {
  return await getDoc(doc(db, `blogs/${id}`)).then((snap) => snap.data());
};
