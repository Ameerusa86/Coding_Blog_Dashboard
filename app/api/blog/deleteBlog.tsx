import { db, storage } from "@/lib/firebase";
import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const DeleteBlog = async (slug: string) => {
  if (!slug) throw new Error("Blog id is required");

  try {
    const firestoreRef = doc(db, `blogs/${slug}`);
    await deleteDoc(firestoreRef);

    const imageRef = ref(storage, `blogs/${slug}`);
    await deleteObject(imageRef);

    console.log("Blog successfully deleted");
  } catch (error) {
    console.error("Error deleting Blog:", error);
    throw new Error("Failed to delete Blog");
  }
};
