import Link from "next/link";
import React from "react";
import {
  RiDashboardLine,
  RiArticleLine,
  RiFolderLine,
  RiUserLine,
} from "react-icons/ri";

const SideBar = () => {
  const links = [
    { icon: <RiDashboardLine />, label: "Dashboard", link: "/admin/dashboard" },
    { icon: <RiArticleLine />, label: "Blogs", link: "/admin/blogs" },
    { icon: <RiFolderLine />, label: "Categories", link: "/admin/categories" },
    { icon: <RiUserLine />, label: "Authors", link: "/admin/authors" },
  ];

  return (
    <div className="w-64 border-r h-screen p-6 bg-gray-100">
      <div className="flex flex-col gap-4">
        {links.map((item, index) => (
          <Link
            className="flex gap-3 items-center bg-white rounded-full py-2 px-4 shadow transition-all duration-200 hover:bg-blue-50 hover:shadow-lg hover:scale-105"
            href={item.link}
            key={index}
          >
            <div className="text-blue-500">{item.icon}</div>
            <span className="text-gray-700">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SideBar;
