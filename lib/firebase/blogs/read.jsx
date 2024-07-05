"use client";

import { db } from "@/lib/firebase";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import useSWRSubscription from "swr/subscription";

export function useBlogs() {
  const { data, error } = useSWRSubscription(["blogs"], ([path], { next }) => {
    const ref = collection(db, path);

    const unsub = onSnapshot(
      ref,
      (snaps) => {
        next(
          null,
          snaps.docs.map((doc) => doc.data())
        );
      },
      (error) => {
        next(error);
      }
    );

    // Return the unsubscribe function
    return unsub;
  });

  return {
    categories: data,
    isLoading: !error && !data,
  };
}

export const getBlog = async (id) => {
  return await getDoc(doc(db, `blogs/${id}`));
};
