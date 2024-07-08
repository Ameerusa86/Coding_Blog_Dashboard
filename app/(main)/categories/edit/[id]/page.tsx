"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa"; // Import calendar icon
import { Category } from "@/types/category";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

interface CategoryEditPageProps {
  params: {
    id: string;
  };
}

const BlogEditPage = ({ params }: CategoryEditPageProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategories] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const postDoc = doc(db, "categories", params.id);
        const postSnapshot = await getDoc(postDoc);
        if (postSnapshot.exists()) {
          setCategories(postSnapshot.data() as Category);
        } else {
          setError("Category not found");
        }
      } catch (error) {
        setError("Failed to fetch Category");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [params.id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: category?.title || "",
    },
  });

  useEffect(() => {
    if (category) {
      form.reset(category);
    }
  }, [category, form]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!category) return;
    try {
      const postDoc = doc(db, "categories", category.id);
      await updateDoc(postDoc, data);
      toast({
        title: "Category updated successfully",
        description: `Category Updated: New title: ${data.title}`,
      });
      router.push("/categories");
    } catch (error) {
      toast({
        title: "Failed to update category",
        description: "An error occurred while updating the category",
      });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <BackButton text="Back To Categories" link="/categories" />
      <h3 className="text-2xl mb-4">Edit Blog</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Title
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Title"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Body
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Body"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          {/* 
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Author
                </FormLabel>
                <FormControl>
                  <Input
                    className="bg-slate-100 dark:bg-slate-500 border-0 focus-visible:ring-0 text-black dark:text-white focus-visible:ring-offset-0"
                    placeholder="Enter Author"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          {/* <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center uppercase text-xs font-bold text-zinc-500 dark:text-white">
                  Date
                  <button
                    type="button"
                    onClick={() =>
                      field.onChange(new Date().toISOString().split("T")[0])
                    }
                  >
                    <FaCalendarAlt className="ml-2" />
                  </button>
                </FormLabel>
                <FormControl>
                  <DatePicker
                    className="w-full px-4 py-2 rounded bg-slate-100 dark:bg-slate-500 border-0 text-black dark:text-white"
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(date) =>
                      field.onChange(
                        date ? date.toISOString().split("T")[0] : ""
                      )
                    }
                    dateFormat="yyyy-MM-dd"
                  /> */}
          {/* </FormControl>
                <FormMessage />
              </FormItem> */}

          <Button className="w-full dark:bg-slate-800 dark:text-white">
            Update Category
          </Button>
        </form>
      </Form>
    </>
  );
};

export default BlogEditPage;
