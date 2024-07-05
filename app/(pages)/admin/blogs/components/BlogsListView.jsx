"use client";

import Link from "next/link";
import { useBlogs } from "@/lib/firebase/blogs/read";

export default function BlogsListView() {
  const { categories, error, isLoading } = useBlogs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        Error: {error.message}
      </div>
    );
  }
  if (!categories || categories.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">No data</div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr>
            <th className="py-2 px-4 bg-gray-200 border-b text-center">#</th>
            <th className="py-2 px-4 bg-gray-200 border-b text-left">Title</th>
            <th className="py-2 px-4 bg-gray-200 border-b text-left">Slug</th>
            <th className="py-2 px-4 bg-gray-200 border-b text-center">
              Image
            </th>
            <th className="py-2 px-4 bg-gray-200 border-b text-center">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {categories.map((item, index) => (
            <tr
              key={item.id}
              className="hover:bg-gray-100 transition duration-300"
            >
              <td className="py-2 px-4 border-b text-center">{index + 1}</td>
              <td className="py-2 px-4 border-b text-left">{item.name}</td>
              <td className="py-2 px-4 border-b text-left">{item.slug}</td>
              <td className="py-2 px-4 border-b text-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-full mx-auto"
                />
              </td>
              <td className="py-2 px-4 border-b text-center">
                <Link
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                  href={`/admin/blogs/form?id=${item.id}`}
                >
                  Action
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
