"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useBlogForm } from "./context/BlogFormContext";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCategories } from "@/lib/firebase/category/read";
import { useAuthors } from "@/lib/firebase/author/read";
import { RTEField } from "./components/RTEField";

const BlogForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateBlogId = searchParams.get("id");

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
  } = useBlogForm();

  useEffect(() => {
    if (updateBlogId) {
      fetchAData(updateBlogId);
    }
  }, [updateBlogId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateBlogId) {
      await handleUpdate(updateBlogId);
    } else {
      await handleCreate();
    }
    resetForm();
  };

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this Blog?")) {
      handleDelete(updateBlogId);
    }
  };

  const resetForm = () => {
    handleData("name", "");
    handleData("slug", "");
    setImage(null);
  };

  const navigateToBlogs = () => {
    router.push("/admin/blogs"); // Navigate to blogs page
  };

  useEffect(() => {
    if (isDone) {
      navigateToBlogs(); // Navigate when action is completed
    }
  }, [isDone]);

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Blog Form</h1>
      {!updateBlogId && (
        <div className="flex mb-5">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 mb-5"
            onClick={resetForm}
          >
            Create New Blog
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Blog Name <span className="text-red-500">*</span>
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
            Blog Slug <span className="text-red-500">*</span>
          </label>
          <input
            disabled
            id="slug"
            name="slug"
            value={(data.name ?? "").replace(/\s+/g, "-").toLowerCase()}
            className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <SelectCategoryField handleData={handleData} />
        <SelectAuthorField handleData={handleData} />

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
              : updateBlogId
              ? "Update Blog"
              : "Create New Blog"}
          </button>
          {updateBlogId && (
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200 mb-5 ml-3"
              onClick={confirmDelete}
            >
              Delete Blog
            </button>
          )}
        </div>

        {isDone && (
          <p className="text-green-500">
            Blog has been {updateBlogId ? "updated" : "created"} successfully
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <RTEField />
    </div>
  );
};

export default BlogForm;

function SelectCategoryField({ handleData }) {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>Error loading categories: {error.message}</p>;
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor="category"
        className="text-sm font-medium text-gray-700 mb-1"
      >
        Category <span className="text-red-500">*</span>
      </label>
      <select
        id="category"
        name="category"
        onChange={(e) => handleData("category", e.target.value)}
        className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a category</option>
        {categories &&
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </select>
    </div>
  );
}

function SelectAuthorField({ id, handleData }) {
  const { authors, isLoading, error } = useAuthors();

  if (isLoading) {
    return <p>Loading authors...</p>;
  }

  if (error) {
    return <p>Error loading authors: {error.message}</p>;
  }

  return (
    <div className="flex flex-col">
      <label
        htmlFor="author"
        className="text-sm font-medium text-gray-700 mb-1"
      >
        Author <span className="text-red-500">*</span>
      </label>
      <select
        id="author"
        name="author"
        onChange={(e) => handleData("author", e.target.value)}
        className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select an Author</option>
        {authors &&
          authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
      </select>
    </div>
  );
}

// To select multiple categories, use the following code:
/*
function SelectCategoryField({ handleData }) {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return <p>Loading categories...</p>;
  }

  if (error) {
    return <p>Error loading categories: {error.message}</p>;
  }

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    handleData("categories", selectedOptions);
  };

  return (
    <div className="flex flex-col">
      <label
        htmlFor="category"
        className="text-sm font-medium text-gray-700 mb-1"
      >
        Categories <span className="text-red-500">*</span>
      </label>
      <select
        id="category"
        name="category"
        multiple // Allow multiple selections
        onChange={handleCategoryChange}
        className="border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent"
      >
        {categories &&
          categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
      </select>
    </div>
  );
}

*/
