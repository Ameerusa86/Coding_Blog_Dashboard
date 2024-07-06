"use client";

import React, { useEffect, useState } from "react";
import { getAllBlogs } from "../lib/firebase/blogs/read_server";
import { getAuthor } from "../lib/firebase/author/read_server";
import Card from "@/components/Card";

const BlogsListView = () => {
  const [blogs, setBlogs] = useState([]);
  const [authorImages, setAuthorImages] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogsData = await getAllBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error("Error fetching blogs in component: ", error);
      }
    };

    fetchBlogs();
  }, []);

  // useEffect(() => {
  //   const fetchAuthorImages = async () => {
  //     const authorImagesPromises = blogs.map((blog) => getAuthor(blog));
  //     const images = await Promise.all(authorImagesPromises);
  //     setAuthorImages(images);
  //   };

  //   fetchAuthorImages();
  // }, [blogs]);

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <h1 className="text-4xl font-bold text-center text-gray-800 mt-20">
          No blogs available
        </h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 place-items-center">
      {blogs.map((blog) => (
        <div key={blog.id}>
          {" "}
          <Card blog={blog} />
        </div>
      ))}
    </div>
  );
};

export default BlogsListView;
