"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CreateNewBlog } from "@/app/api/blog/createBlog";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { CreateNewCategory } from "@/app/api/category/createCategory";

// Dynamically import the rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import("@/components/ui/RichTextEditor"), {
  ssr: false,
});

interface CategoryFormData {
  title: string;
  slug: string;
  createdAt?: string;
}

const NewCategoryForm = () => {
  const [categoryData, setCategoryData] = useState<CategoryFormData>({
    title: "",
    slug: "",
    createdAt: new Date().toISOString(),
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await CreateNewCategory(categoryData);
      toast.success(
        `Category created successfully on ${new Date().toLocaleString()}`
      );
      setCategoryData({
        title: "",
        slug: "",
        createdAt: new Date().toISOString(),
      });
      router.push("/categories");
    } catch (error) {
      console.error("Failed to create category:", error);
      toast.error("Failed to create category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCategoryData({ ...categoryData });
    }
  };

  const handleSlugChange = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    setCategoryData((prevData) => ({
      ...prevData,
      title,
      slug,
    }));
  };

  return (
    <>
      <Toaster />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-8">Create New Blog</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <div className="w-full sm:w-1/2">
              <label htmlFor="title" className="block mb-1 font-semibold">
                Title:
              </label>
              <input
                type="text"
                id="title"
                value={categoryData.title}
                onChange={(e) => handleSlugChange(e.target.value)}
                required
                className="w-full px-4 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="w-full sm:w-1/2">
              <label htmlFor="slug" className="block mb-1 font-semibold">
                Slug:
              </label>
              <input
                type="text"
                id="slug"
                value={categoryData.slug}
                readOnly
                className="w-full px-4 py-2 rounded border bg-gray-200 cursor-not-allowed focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            {loading ? "Creating..." : "Create Category"}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewCategoryForm;
