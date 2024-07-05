"use client";

import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useSWR from "swr";

export function useCategories() {
  const fetcher = (path) => {
    return new Promise((resolve, reject) => {
      const ref = collection(db, path);
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          const categories = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          resolve(categories);
        },
        (error) => {
          reject(error);
        }
      );

      // Return the unsubscribe function
      return unsub;
    });
  };

  const { data, error } = useSWR("categories", fetcher);

  return {
    categories: data,
    isLoading: !error && !data,
    error,
  };
}
