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
import { Category } from "@/types/category";
import fetchAllCategories from "@/app/api/category/getCategory";

interface CategoriesTableProps {
  limit?: number;
  title?: string;
}

const CategoriesTable = ({ limit, title }: CategoriesTableProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCategories = await fetchAllCategories();
        setCategories(fetchedCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false); // Handle loading state in case of error
      }
    };

    fetchData();
  }, []);

  return (
    <div className="mt-10">
      <h3 className="text-2xl mb-4 font-semibold">
        {title ? title : "Categories"}
      </h3>
      <div className="flex justify-end mb-4">
        <Link
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          href="/categories/new_category"
        >
          Add New Category
        </Link>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <Table>
          <TableCaption>A list of recent Categories</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              {/* <TableHead className="hidden md:table-cell">Author</TableHead> */}
              {/* <TableHead className="hidden md:table-cell text-right">
                Date
              </TableHead> */}
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.title}</TableCell>
                {/* <TableCell className="hidden md:table-cell">
                  {category.author}
                </TableCell>
                <TableCell className="text-right hidden md:table-cell">
                  {category.date}
                </TableCell> */}
                <TableCell>
                  <Link
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs"
                    href={`/categories/edit/${category.id}`}
                  >
                    Edit
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CategoriesTable;
