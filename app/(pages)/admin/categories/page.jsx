import Link from "next/link";
import React from "react";
import CategoriesListView from "@/app/(pages)/admin/categories/components/CategoriesListView";

const CategoriesAdminPage = () => {
  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href={"/admin/categories/form"}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200">
            Add Category
          </button>
        </Link>
      </div>

      <CategoriesListView />
    </div>
  );
};

export default CategoriesAdminPage;
