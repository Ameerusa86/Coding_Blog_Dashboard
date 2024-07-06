import { db } from "@/lib/firebase";
import { doc, getDocs } from "firebase/firestore";

export const getAuthor = async (id) => {
  return await getDocs(doc(db, `authors/${id}`)).then((snap) => snap.data());
};
export default getAuthor;
