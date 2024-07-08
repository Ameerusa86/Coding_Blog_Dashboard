"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { Avatar } from "@/components/ui/avatar";

const UserProfile = () => {
  const [user, setUser] = useState<{
    photoURL?: string | null;
    displayName?: string | null;
    src: string;
  } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const { photoURL, displayName } = firebaseUser;
        setUser({ photoURL, displayName, src: "" });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <Avatar className="h-10 w-10" />
          <span className="text-lg font-medium">{user.displayName}</span>
        </>
      ) : (
        <span className="text-lg font-medium">User not logged in</span>
      )}
    </div>
  );
};

export default UserProfile;
