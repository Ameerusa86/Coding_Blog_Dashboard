import { db, storage } from "@/lib/firebase";
import { deleteDoc, doc, setDoc, Timestamp } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";

export const CreateNewAuthor = async (data, image) => {
  if (!data.name) {
    throw new Error("Author name is required");
  }
  if (!data.slug) {
    throw new Error("Author slug is required");
  }
  if (!image) {
    throw new Error("Author image is required");
  }

  try {
    const imageRef = ref(storage, `authors/${data.slug}`);
    await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(imageRef);

    const firestoreRef = doc(db, `authors/${data.slug}`);
    await setDoc(firestoreRef, {
      ...data,
      id: data.slug,
      image: imageUrl,
      createdAt: Timestamp.now(),
    });

    console.log("Author successfully created");
  } catch (error) {
    console.error("Error creating author:", error);
    throw new Error("Failed to create Author");
  }
};

export const updateAuthor = async (data, image) => {
  if (!data.name) {
    throw new Error("Author name is required");
  }
  if (!data.slug) {
    throw new Error("Author slug is required");
  }

  try {
    let imageURL = data.image; // Default to existing image URL if not updating image

    if (image) {
      const imageRef = ref(storage, `authors/${data.slug}`);
      await uploadBytes(imageRef, image);
      imageURL = await getDownloadURL(imageRef);
    }

    const firestoreRef = doc(db, `authors/${data.id}`);
    await setDoc(firestoreRef, {
      ...data,
      image: imageURL,
      updatedAt: Timestamp.now(),
    });

    console.log("Author successfully updated");
  } catch (error) {
    console.error("Error updating Author:", error);
    throw new Error("Failed to update Author");
  }
};

export const deleteAuthor = async (id) => {
  try {
    const firestoreRef = doc(db, `authors/${id}`);
    await deleteDoc(firestoreRef);

    const imageRef = ref(storage, `authors/${id}`);
    await deleteObject(imageRef);

    console.log("Author successfully deleted");
  } catch (error) {
    console.error("Error deleting Author:", error);
    throw new Error("Failed to delete Author");
  }
};
