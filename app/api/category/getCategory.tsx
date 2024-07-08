import { db } from "@/lib/firebase";
import { Category } from "@/types/category";
import { collection, getDocs } from "firebase/firestore";

const fetchAllCategories = async (): Promise<Category[]> => {
  try {
    const blogsRef = collection(db, "categories");
    const snapshot = await getDocs(blogsRef);
    const blogs: Category[] = snapshot.docs.map(
      (doc) => doc.data() as Category
    );
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export default fetchAllCategories;
