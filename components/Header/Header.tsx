import Image from "next/image";
import Link from "next/link";
import React from "react";
import LoginButton from "./LoginButton";
import AuthProvider from "@/lib/context/AuthContext";

const Header = () => {
  const Nav_Links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Blog",
      href: "/blog",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b bg-white shadow-sm">
      <Link href={"/"} className="flex items-center">
        <h1 className="text-xl font-semibold tracking-wide">LOGO</h1>
      </Link>
      <ul className="flex items-center space-x-6">
        {Nav_Links.map((link) => (
          <li key={link.name}>
            <Link
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
              href={link.href}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center">
        <AuthProvider>
          <LoginButton />
        </AuthProvider>
      </div>
    </nav>
  );
};

export default Header;
