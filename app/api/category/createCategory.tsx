import { db } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";

export const CreateNewCategory = async (data: {
  title: string;
  slug: string;
}) => {
  if (!data.title || !data.slug) {
    throw new Error("Category title and slug are required");
  }

  try {
    const firestoreRef = doc(db, `categories`, data.slug);
    await setDoc(firestoreRef, {
      ...data,
      id: data.slug,
      createdAt: Timestamp.now(),
    });

    console.log("Category successfully created");
  } catch (error) {
    console.error("Error creating Category:", error);
    throw new Error("Failed to create Category");
  }
};
