"use client";

import { createContext, use, useContext, useState } from "react";
import {
  CreateNewCategory,
  deleteCategory,
  updateCategory,
} from "@/lib/firebase/category/write";
import { getCategory } from "@/lib/firebase/category/read";

// Define the context
export const CategoryFormContext = createContext();

export default function CategoryFormContextProvider({ children }) {
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
      await CreateNewCategory(data, image);
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
      // Call updateCategory with data and image state
      await updateCategory(data, image || null);
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
      await deleteCategory(data.id); // Replace with your delete function
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
      const res = await getCategory(id);
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
    <CategoryFormContext.Provider
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
    </CategoryFormContext.Provider>
  );
}

export const useCategoryForm = () => useContext(CategoryFormContext);
