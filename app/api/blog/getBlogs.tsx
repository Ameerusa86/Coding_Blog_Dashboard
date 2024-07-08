import { db } from "@/lib/firebase";
import { Blog } from "@/types/blogs";
import { collection, getDocs } from "firebase/firestore";

const fetchAllBlogs = async (): Promise<Blog[]> => {
  try {
    const blogsRef = collection(db, "blogs");
    const snapshot = await getDocs(blogsRef);
    const blogs: Blog[] = snapshot.docs.map((doc) => doc.data() as Blog);
    return blogs;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

export default fetchAllBlogs;
