import Link from "next/link";
import React from "react";
import AuthorsListView from "./components/AuthorsListView";

const CategoriesAdminPage = () => {
  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Authors</h1>
        <Link href={"/admin/authors/form"}>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200">
            Add New Author
          </button>
        </Link>
      </div>

      <AuthorsListView />
    </div>
  );
};

export default CategoriesAdminPage;
