import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const fetchCategoryCount = async (): Promise<number> => {
  try {
    const blogsRef = collection(db, "categories");
    const q = query(blogsRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    console.error("Error fetching category count:", error);
    return 0; // Return 0 in case of an error
  }
};

export default fetchCategoryCount;
