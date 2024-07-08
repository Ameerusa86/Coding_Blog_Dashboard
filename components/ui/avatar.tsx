"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [user, setUser] = useState<null | {
    photoURL?: string;
    displayName?: string;
    src: string;
  }>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const { photoURL, displayName } = firebaseUser;
        setUser({
          photoURL: photoURL || undefined,
          displayName: displayName || undefined,
          src: photoURL || "",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
        className
      )}
      {...props}
    >
      {user?.photoURL ? (
        <AvatarPrimitive.Image
          ref={ref as React.RefObject<HTMLImageElement>}
          src={user.photoURL}
          alt={user.displayName}
          className={cn("aspect-square h-full w-full", className)}
        />
      ) : (
        <AvatarPrimitive.Fallback
          ref={ref}
          className={cn(
            "flex h-full w-full items-center justify-center rounded-full bg-muted text-white"
          )}
        >
          {user?.displayName ? user.displayName.charAt(0).toUpperCase() : ""}
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

export { Avatar };
