import { db, storage } from "@/lib/firebase";
import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const CreateNewBlog = async (data, image) => {
  if (!data.name) {
    throw new Error("Blog name is required");
  }
  if (!data.slug) {
    throw new Error("Blog slug is required");
  }
  if (!image) {
    throw new Error("Blog image is required");
  }

  try {
    const imageRef = ref(storage, `blogs/${data.slug}`);
    await uploadBytes(imageRef, image); // Ensure correct parameter
    const imageUrl = await getDownloadURL(imageRef);

    const firestoreRef = doc(db, `blogs/${data.slug}`);
    await setDoc(firestoreRef, {
      ...data,
      id: data.slug,
      image: imageUrl,
      createdAt: Timestamp.now(),
    });

    console.log("Blog successfully created");
  } catch (error) {
    console.error("Error creating Blog:", error);
    throw new Error("Failed to create Blog");
  }
};

export const updateBlog = async (data, image) => {
  if (!data.name) {
    throw new Error("Blog name is required");
  }
  if (!data.slug) {
    throw new Error("Blog slug is required");
  }

  try {
    let imageURL = data.image; // Default to existing image URL if not updating image

    if (image) {
      const imageRef = ref(storage, `blogs/${data.slug}`);
      await uploadBytes(imageRef, image);
      imageURL = await getDownloadURL(imageRef);
    }

    const firestoreRef = doc(db, `blogs/${data.id}`);
    await setDoc(firestoreRef, {
      ...data,
      image: imageURL,
      updatedAt: Timestamp.now(),
    });

    console.log("Blog successfully updated");
  } catch (error) {
    console.error("Error updating Blog:", error);
    throw new Error("Failed to update Blog");
  }
};

export const deleteBlog = async (blogId) => {
  try {
    const firestoreRef = doc(db, `blogs/${blogId}`);
    await deleteDoc(firestoreRef);

    const imageRef = ref(storage, `blogs/${blogId}`);
    await deleteObject(imageRef);

    console.log("Blog successfully deleted");
  } catch (error) {
    console.error("Error deleting Blog:", error);
    throw new Error("Failed to delete Blog");
  }
};
