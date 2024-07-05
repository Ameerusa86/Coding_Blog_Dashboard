import Link from "next/link";
import React from "react";
import BlogsListView from "@/app/(pages)/admin/blogs/components/BlogsListView";

const BlogsAdminPage = () => {
  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Link href={"/admin/blogs/form"}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200">
            Add New Blog
          </button>
        </Link>
      </div>

      <BlogsListView />
    </div>
  );
};

export default BlogsAdminPage;
