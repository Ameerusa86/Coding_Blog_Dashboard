"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCategoryForm } from "./context/CategoryFormContext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const CategoryForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateCategoryId = searchParams.get("id");

  const {
    data,
    isLoading,
    handleData,
    handleCreate,
    handleUpdate,
    handleDelete,
    image,
    setImage,
    error,
    isDone,
    fetchAData,
  } = useCategoryForm();

  useEffect(() => {
    if (updateCategoryId) {
      fetchAData(updateCategoryId);
    }
  }, [updateCategoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateCategoryId) {
      await handleUpdate(updateCategoryId);
    } else {
      await handleCreate();
    }
    resetForm();
  };

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      handleDelete(updateCategoryId);
    }
  };

  const resetForm = () => {
    handleData("name", "");
    handleData("slug", "");
    setImage(null);
  };

  const navigateToCategories = () => {
    router.push("/admin/categories"); // Navigate to categories page
  };

  useEffect(() => {
    if (isDone) {
      navigateToCategories(); // Navigate when action is completed
    }
  }, [isDone]);

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Category Form</h1>
      {!updateCategoryId && (
        <div className="flex mb-5">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 mb-5"
            onClick={() => {
              // Add your create logic here
            }}
          >
            Create New Category
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Category Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={data.name || ""}
            onChange={(e) => {
              handleData("name", e.target.value);
              handleData(
                "slug",
                e.target.value.replace(/\s+/g, "-").toLowerCase()
              );
            }}
            required
            className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="slug"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Category Slug <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            id="slug"
            name="slug"
            value={data.slug || ""}
            onChange={(e) => handleData("slug", e.target.value)}
            className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {data.iconURL && (
          <div>
            <Image src={data.iconURL} alt="icon" width={200} height={200} />
          </div>
        )}
        {image && (
          <div>
            <Image
              src={URL.createObjectURL(image)}
              alt="image"
              width={200}
              height={200}
            />
          </div>
        )}
        <div className="flex flex-col">
          <label
            htmlFor="image"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
            onChange={(e) => {
              e.preventDefault();
              setImage(e.target.files[0]);
            }}
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors duration-200"
          >
            {isLoading
              ? "Loading..."
              : updateCategoryId
              ? "Update Category"
              : "Create New Category"}
          </button>
          {updateCategoryId && (
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200 mb-5 ml-3"
              onClick={confirmDelete}
            >
              Delete Category
            </button>
          )}
        </div>

        {isDone && (
          <p className="text-green-500">
            Category has been {updateCategoryId ? "updated" : "created"}{" "}
            successfully
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default CategoryForm;
