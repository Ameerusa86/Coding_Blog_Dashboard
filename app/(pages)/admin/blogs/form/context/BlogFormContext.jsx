"use client";

import { getBlog } from "@/lib/firebase/blogs/read";
import { createContext, useContext, useState } from "react";
import {
  CreateNewBlog,
  updateBlog,
  deleteBlog,
} from "@/lib/firebase/blogs/write"; // Adjust the path as necessary

// Define the context
export const BlogFormContext = createContext();

export default function BlogFormContextProvider({ children }) {
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [isDone, setIsDone] = useState(false);

  const handleData = (key, value) => {
    setData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreate = async () => {
    setError(null);
    setIsLoading(true);
    setIsDone(false);
    try {
      await CreateNewBlog(data, image);
      setIsDone(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError(null);
    setIsLoading(true);
    setIsDone(false);

    try {
      await updateBlog(data, image || null);
      setIsDone(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);
    setIsDone(false);

    try {
      await deleteBlog(data.id); // Replace with your delete function
      setIsDone(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAData = async (id) => {
    setError(null);
    setIsLoading(true);
    setIsDone(false);
    try {
      const res = await getBlog(id);
      if (res.exists()) {
        const data = res.data();
        setData(data);
      } else {
        setError("Data not found");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <BlogFormContext.Provider
      value={{
        data,
        isLoading,
        error,
        handleData,
        handleCreate,
        handleUpdate,
        handleDelete,
        image,
        setImage,
        isDone,
        fetchAData,
      }}
    >
      {children}
    </BlogFormContext.Provider>
  );
}

export const useBlogForm = () => useContext(BlogFormContext);
