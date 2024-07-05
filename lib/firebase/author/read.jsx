// "use client";

// import { db } from "@/lib/firebase";
// import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
// import useSWRSubscription from "swr/subscription";

// export function useAuthors() {
//   const { data, error } = useSWRSubscription(
//     ["authors"],
//     ([path], { next }) => {
//       const ref = collection(db, path);

//       const unsub = onSnapshot(
//         ref,
//         (snaps) => {
//           next(
//             null,
//             snaps.docs.map((doc) => doc.data())
//           );
//         },
//         (error) => {
//           next(error);
//         }
//       );

//       // Return the unsubscribe function
//       return unsub;
//     }
//   );

//   return {
//     authors: data,
//     isLoading: !error && !data,
//   };
// }

// export const getAuthor = async (id) => {
//   return await getDoc(doc(db, `authors/${id}`));
// };

"use client";

import { auth, db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import useSWR from "swr";

export function useAuthors() {
  const fetcher = (path) => {
    return new Promise((resolve, reject) => {
      const ref = collection(db, path);
      const unsub = onSnapshot(
        ref,
        (snapshot) => {
          const authors = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          resolve(authors);
        },
        (error) => {
          reject(error);
        }
      );

      // Return the unsubscribe function
      return unsub;
    });
  };

  const { data, error } = useSWR("authors", fetcher);

  return {
    authors: data,
    isLoading: !error && !data,
    error,
  };
}
