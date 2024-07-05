"use client";

import Image from "next/image";
import React from "react";
import { Google_logo } from "@/public/images";
import { useAuth } from "@/lib/context/AuthContext";
import Link from "next/link";

const LoginButton = () => {
  const { handlingSignInWithGoogle, user, loading, error, handleLogout } =
    useAuth();

  if (user) {
    return (
      <div
        className="
        flex
        items-center
        gap-4
        bg-gray-100
        p-4
        rounded-lg
        mt-3
        max-w-md
        w-full
        
        shadow-md
        ml-auto
        mr-4"
      >
        <button
          onClick={handleLogout}
          disabled={loading}
          className="flex items-center bg-red-500 text-white gap-2 px-4 py-2 rounded-full hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
        <Link href={"/admin"}>
          <div className="flex items-center gap-2">
            <Image
              src={user.photoURL}
              alt={user.displayName}
              width={50}
              height={50}
              className="rounded-full cursor-pointer hover:scale-110 transition duration-200"
            />
            <div className="flex flex-col">
              <p className="text-black font-semibold cursor-pointer hover:underline transition duration-200">
                {user.displayName}
              </p>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>
        </Link>
      </div>
    );
  }

  return (
    <button
      onClick={handlingSignInWithGoogle}
      disabled={loading}
      className="flex items-center bg-black text-white gap-3 px-4 py-2 rounded-full hover:bg-gray-800 transition duration-200"
    >
      <Image src={Google_logo} alt="Google Logo" width={20} height={20} />
      Login
    </button>
  );
};

export default LoginButton;
