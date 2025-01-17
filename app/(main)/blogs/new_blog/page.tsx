"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CreateNewBlog } from "@/app/api/blog/createBlog";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

interface BlogFormData {
  title: string;
  slug: string;
  description: string;
  author: string;
  mainImage: File | null;
  category: string;
  technologies: string[];
  githubLink: string;
  publishedAt?: string;
  body: string;
}

const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { font: [] as string[] }],
    [{ size: [] as string[] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["code-block"],
    [{ align: [] as string[] }],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "image",
  "video",
  "code-block",
  "align",
];

const NewBlogForm: React.FC = () => {
  const [blogData, setBlogData] = useState<BlogFormData>({
    title: "",
    slug: "",
    description: "",
    author: "",
    mainImage: null,
    category: "",
    technologies: [],
    githubLink: "",
    publishedAt: new Date().toISOString(),
    body: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      await CreateNewBlog(blogData, blogData.mainImage!);
      toast.success(
        `Blog created successfully by ${
          blogData.author
        } on ${new Date().toLocaleString()}`
      );
      setBlogData({
        title: "",
        slug: "",
        description: "",
        author: "",
        mainImage: null,
        category: "",
        technologies: [],
        githubLink: "",
        publishedAt: new Date().toISOString(),
        body: "",
      });
      router.push("/blogs");
    } catch (error) {
      console.error("Failed to create blog:", error);
      toast.error("Failed to create blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBlogData({ ...blogData, mainImage: file });
    }
  };

  const handleTechnologiesChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    setBlogData((prevData) => ({
      ...prevData,
      technologies: prevData.technologies.includes(value)
        ? prevData.technologies.filter((tech) => tech !== value)
        : [...prevData.technologies, value],
    }));
  };

  const handleSlugChange = (title: string) => {
    const slug = title.toLowerCase().replace(/\s+/g, "-");
    setBlogData((prevData) => ({
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
                value={blogData.title}
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
                value={blogData.slug}
                readOnly
                className="w-full px-4 py-2 rounded border cursor-not-allowed focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>
          <div>
            <label htmlFor="description" className="block mb-1 font-semibold">
              Description:
            </label>
            <ReactQuill
              id="description"
              value={blogData.description}
              onChange={(value) =>
                setBlogData((prevData) => ({ ...prevData, description: value }))
              }
              modules={modules}
              formats={formats}
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="author" className="block mb-1 font-semibold">
              Author:
            </label>
            <input
              type="text"
              id="author"
              value={blogData.author}
              onChange={(e) =>
                setBlogData({ ...blogData, author: e.target.value })
              }
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="body" className="block mb-1 font-semibold">
              Body:
            </label>
            <ReactQuill
              id="body"
              value={blogData.body}
              onChange={(value) =>
                setBlogData((prevData) => ({ ...prevData, body: value }))
              }
              modules={modules}
              formats={formats}
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label htmlFor="mainImage" className="block mb-1 font-semibold">
              Main Image:
            </label>
            <input
              type="file"
              id="mainImage"
              accept="image/*"
              onChange={handleImageChange}
              required
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold">Category:</label>
            <select
              id="category"
              value={blogData.category}
              onChange={(e) =>
                setBlogData({ ...blogData, category: e.target.value })
              }
              required
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
            >
              <option value="">Select category</option>
              <option value="FrontEnd">Front End</option>
              <option value="BackEnd">Back End</option>
              <option value="FullStack">Full Stack</option>
              <option value="Python">Python</option>
              <option value="DataAnalytics">Data Analytics</option>
              <option value="RESTAPI">REST API</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">Technologies:</label>
            <div>
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="React"
                  checked={blogData.technologies.includes("React")}
                  onChange={handleTechnologiesChange}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <span className="ml-2">React</span>
              </label>
              {/* Add more technology checkboxes as needed */}
            </div>
          </div>
          <div>
            <label htmlFor="githubLink" className="block mb-1 font-semibold">
              GitHub Link:
            </label>
            <input
              type="text"
              id="githubLink"
              value={blogData.githubLink}
              onChange={(e) =>
                setBlogData({ ...blogData, githubLink: e.target.value })
              }
              required
              className="w-full px-4 py-2 rounded border focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>
    </>
  );
};

export default NewBlogForm;
