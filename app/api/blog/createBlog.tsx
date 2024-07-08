import { db, storage } from "@/lib/firebase";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const CreateNewBlog = async (
  data: {
    title: string;
    slug: string;
    description: string;
    author: string;
    category: string;
    technologies: string[];
    githubLink: string;
  },
  image: File
) => {
  if (!data.title) throw new Error("Blog title is required");
  if (!data.slug) throw new Error("Blog slug is required");
  if (!image) throw new Error("Blog image is required");

  try {
    const imageRef = ref(storage, `blogs/${data.slug}`);
    await uploadBytes(imageRef, image);
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
