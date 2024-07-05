"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useAuthorForm } from "./context/AuthorFormContext";

const AuthorForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateAuthorId = searchParams.get("id");

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
  } = useAuthorForm();

  useEffect(() => {
    if (updateAuthorId) {
      fetchAData(updateAuthorId);
    }
  }, [updateAuthorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (updateAuthorId) {
      await handleUpdate(updateAuthorId);
    } else {
      await handleCreate();
    }
    resetForm();
  };

  const confirmDelete = () => {
    if (window.confirm("Are you sure you want to delete this Author?")) {
      handleDelete(updateAuthorId);
    }
  };

  const resetForm = () => {
    handleData("name", "");
    handleData("slug", "");
    setImage(null);
  };

  const navigateToAuthors = () => {
    router.push("/admin/authors"); // Navigate to authors page
  };

  useEffect(() => {
    if (isDone) {
      navigateToAuthors(); // Navigate when action is completed
    }
  }, [isDone]);

  return (
    <div className="container mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6">Author Form</h1>
      {!updateAuthorId && (
        <div className="flex mb-5">
          <button
            type="button"
            className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition-colors duration-200 mb-5"
            onClick={() => {
              resetForm();
            }}
          >
            Create New Author
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Author Name <span className="text-red-500">*</span>
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
            Author Slug <span className="text-red-500">*</span>
          </label>
          <input
            id="slug"
            name="slug"
            value={data.slug || ""}
            disabled
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
              : updateAuthorId
              ? "Update Author"
              : "Create New Author"}
          </button>
          {updateAuthorId && (
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200 mb-5 ml-3"
              onClick={confirmDelete}
            >
              Delete Author
            </button>
          )}
        </div>

        {isDone && (
          <p className="text-green-500">
            Author has been {updateAuthorId ? "updated" : "created"}{" "}
            successfully
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default AuthorForm;
