"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import Link from "next/link";
import { Blog } from "@/types/blogs";
import fetchAllBlogs from "@/app/api/blog/getBlogs";
import { DeleteBlog } from "@/app/api/blog/deleteBlog";
import { format } from "date-fns"; // Import date-fns

interface PostsTableProps {
  limit?: number;
  title?: string;
}

const PostsTable = ({ limit, title }: PostsTableProps) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedPosts = await fetchAllBlogs();
        setBlogs(fetchedPosts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setLoading(false); // Handle loading state in case of error
      }
    };

    fetchData();
  }, []);

  // Sort posts in dec order based on date
  const sortedPosts = [...blogs].sort(
    (a, b) =>
      new Date(b.createdAt.seconds * 1000).getTime() -
      new Date(a.createdAt.seconds * 1000).getTime()
  );

  // Filter posts to limit
  const filteredPosts = limit ? sortedPosts.slice(0, limit) : sortedPosts;

  const handleDelete = async (id: string) => {
    try {
      await DeleteBlog(id);
      // Update state after successful deletion
      setBlogs((prevBlogs) => prevBlogs.filter((blog) => blog.id !== id));
      setConfirmDelete(null); // Close confirmation dialog
      console.log("Blog deleted successfully");
    } catch (error) {
      console.error("Error deleting blog:", error);
      // Handle error scenario
    }
  };

  const openDeleteConfirmation = (id: string) => {
    setConfirmDelete(id);
  };

  const closeDeleteConfirmation = () => {
    setConfirmDelete(null);
  };

  return (
    <div className="mt-10 mx-auto">
      <h3 className="text-2xl mb-4 font-semibold">{title ? title : "Blogs"}</h3>
      <div className="flex justify-end mb-4">
        <Link
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          href="/blogs/new_blog"
        >
          Add New Blog
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableCaption className="mt-10">A list of recent Blogs</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">Title</TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Author
              </TableHead>
              <TableHead className="hidden md:table-cell text-center">
                Date
              </TableHead>
              <TableHead className="text-center">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPosts.map((blog) => (
              <TableRow key={blog.id}>
                <TableCell className="text-center">{blog.title}</TableCell>
                <TableCell className="hidden md:table-cell text-center">
                  {blog.author}
                </TableCell>
                <TableCell className="text-center hidden md:table-cell">
                  {format(new Date(blog.createdAt.seconds * 1000), "PPP")}{" "}
                  {/* Format the date */}
                </TableCell>
                <div className="flex items-center justify-center gap-0 m-0 p-0">
                  <TableCell>
                    <Link
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                      href={`/blogs/edit/${blog.id}`}
                    >
                      Edit
                    </Link>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => openDeleteConfirmation(blog.id)}
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-xs"
                    >
                      Delete
                    </button>
                  </TableCell>
                </div>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {confirmDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center">
          <div className="bg-blue-950 p-6 rounded-lg">
            <p className="mb-4">Are you sure you want to delete this blog?</p>
            <div className="flex justify-end">
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Yes, Delete
              </button>
              <button
                onClick={closeDeleteConfirmation}
                className="ml-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostsTable;
