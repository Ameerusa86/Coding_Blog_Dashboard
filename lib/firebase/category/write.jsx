import { db, storage } from "@/lib/firebase";
import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const CreateNewCategory = async (data, image) => {
  if (!data.name) {
    throw new Error("Category name is required");
  }
  if (!data.slug) {
    throw new Error("Category slug is required");
  }
  if (!image) {
    throw new Error("Category image is required");
  }

  try {
    const imageRef = ref(storage, `categories/${data.slug}`);
    await uploadBytes(imageRef, image); // Ensure correct parameter
    const imageUrl = await getDownloadURL(imageRef);

    const firestoreRef = doc(db, `categories/${data.slug}`);
    await setDoc(firestoreRef, {
      ...data,
      id: data.slug,
      image: imageUrl,
      createdAt: Timestamp.now(),
    });

    console.log("Category successfully created");
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};

export const updateCategory = async (data, image) => {
  if (!data.name) {
    throw new Error("Category name is required");
  }
  if (!data.slug) {
    throw new Error("Category slug is required");
  }

  try {
    let imageURL = data.image; // Default to existing image URL if not updating image

    if (image) {
      const imageRef = ref(storage, `categories/${data.slug}`);
      await uploadBytes(imageRef, image);
      imageURL = await getDownloadURL(imageRef);
    }

    const firestoreRef = doc(db, `categories/${data.id}`);
    await setDoc(firestoreRef, {
      ...data,
      image: imageURL,
      updatedAt: Timestamp.now(),
    });

    console.log("Category successfully updated");
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    const firestoreRef = doc(db, `categories/${categoryId}`);
    await deleteDoc(firestoreRef);

    const imageRef = ref(storage, `categories/${categoryId}`);
    await deleteObject(imageRef);

    console.log("Category successfully deleted");
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};
