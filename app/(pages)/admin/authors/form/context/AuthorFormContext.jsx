"use client";

import { createContext, useContext, useState } from "react";
import { getAuthor } from "@/lib/firebase/author/read";
import {
  CreateNewAuthor,
  deleteAuthor,
  updateAuthor,
} from "@/lib/firebase/author/write";

// Define the context
export const AuthorFormContext = createContext();

export default function AuthorFormContextProvider({ children }) {
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
      await CreateNewAuthor(data, image);
      setIsDone(true);
    } catch (error) {
      setError(error.message);
      console.error("Error creating author:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async () => {
    setError(null);
    setIsLoading(true);
    setIsDone(false);
    try {
      await updateAuthor(data, image || null);
      setIsDone(true);
    } catch (error) {
      setError(error.message);
      console.error("Error updating author:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setError(null);
    setIsLoading(true);
    setIsDone(false);
    try {
      await deleteAuthor(data.id);
      setIsDone(true);
    } catch (error) {
      setError(error.message);
      console.error("Error deleting author:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAData = async (id) => {
    setError(null);
    setIsLoading(true);
    setIsDone(false);
    try {
      const res = await getAuthor(id);
      if (res.exists()) {
        const data = res.data();
        setData(data);
      } else {
        setError("Data not found");
      }
    } catch (error) {
      setError(error.message);
      console.error("Error fetching author data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthorFormContext.Provider
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
    </AuthorFormContext.Provider>
  );
}

export const useAuthorForm = () => useContext(AuthorFormContext);
